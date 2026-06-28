import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserService } from 'src/modules/user/services/user.service';
import { faker } from '@faker-js/faker';
import { plansSeeded } from '../data/plans.seed';
import { Role } from 'src/infra/postgres-databases/main/entities/enums';
import { TENANT_TEMPLATE_SCHEMA } from 'src/infra/postgres-databases/tenant/tenant-template.constants';
import { runTenantMigrationsInSchema } from 'src/infra/postgres-databases/tenant/tenant-migrations.runner';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly moduleRef: ModuleRef,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  private async seedUser() {
    const userService = await this.moduleRef.resolve(
      UserService,
      undefined,
      {
        strict: false,
      },
    );
    await userService.createUser({
      email: 'admin@admin.com',
      name: 'Admin',
      password: 'admin',
      cpf: faker.number
        .int({ min: 10000000000, max: 99999999999 })
        .toString(),
      role: Role.ADMIN,
    });
  }

  /**
   * Ensures `tenant_template` exists and applies pending tenant migrations.
   * Run first in seed so local/testing DBs match current migrations before user/plan data.
   * TenantsService expects this schema when cloning new `tenant_<id>` schemas.
   */
  private async seedTenantTemplate() {
    await this.dataSource.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
    );

    const existing = await this.dataSource.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
      [TENANT_TEMPLATE_SCHEMA],
    );

    if (existing.length === 0) {
      this.logger.log(
        `Creating template schema "${TENANT_TEMPLATE_SCHEMA}"...`,
      );
      await this.dataSource.query(
        `CREATE SCHEMA "${TENANT_TEMPLATE_SCHEMA}"`,
      );
    }

    const executed = await runTenantMigrationsInSchema(
      TENANT_TEMPLATE_SCHEMA,
    );
    if (executed.length === 0) {
      this.logger.log(
        `Template "${TENANT_TEMPLATE_SCHEMA}" is up to date (no pending migrations)`,
      );
    } else {
      this.logger.log(
        `Template "${TENANT_TEMPLATE_SCHEMA}": applied ${executed.length} migration(s): ${executed.map((m) => m.name).join(', ')}`,
      );
    }
  }

  /** Applies pending migrations to each `tenant_<uuid>` listed in public.tenants. */
  private async migrateAllRegisteredTenantSchemas() {
    const rows = await this.dataSource.query(
      'SELECT id FROM public.tenants ORDER BY id',
    );
    const ids = rows.map((r: { id: string }) => r.id);

    if (ids.length === 0) {
      this.logger.log(
        'No rows in public.tenants; skipping per-tenant migrations',
      );
      return;
    }

    this.logger.log(
      `Running tenant migrations for ${ids.length} tenant schema(s)...`,
    );

    for (const id of ids) {
      const schema = `tenant_${id}`;
      const executed = await runTenantMigrationsInSchema(schema);
      if (executed.length === 0) {
        this.logger.log(`  ${schema}: already up to date`);
      } else {
        this.logger.log(
          `  ${schema}: ran ${executed.length} migration(s): ${executed.map((m) => m.name).join(', ')}`,
        );
      }
    }

    this.logger.log('All registered tenant schemas processed');
  }

  /**
   * Creates the "admin role of tenant": ensures each tenant has an
   * "Administrador" permit-all profile and links every OWNER (in
   * enterprise_members) to it, so owners can see all modules and manage other
   * users' profiles.
   *
   * Idempotent. Runs per `tenant_<id>` schema with raw SQL, qualifying tables
   * by schema like the migration runner. Must run AFTER tenant migrations so
   * `profiles` and `pivot_user_profiles` exist.
   */
  private async seedTenantAdminProfiles() {
    const rows = await this.dataSource.query(
      'SELECT id FROM public.tenants ORDER BY id',
    );
    const ids = rows.map((r: { id: string }) => r.id);

    if (ids.length === 0) {
      this.logger.log(
        'No rows in public.tenants; skipping tenant admin profiles',
      );
      return;
    }

    const ADMIN_PROFILE_NAME = 'Administrador';

    for (const id of ids) {
      const schema = `tenant_${id}`;

      // Ensure a single permit-all "Administrador" profile exists.
      const existingProfile = await this.dataSource.query(
        `SELECT "id" FROM "${schema}"."profiles"
           WHERE "name" = $1 AND "deletedAt" IS NULL LIMIT 1`,
        [ADMIN_PROFILE_NAME],
      );

      let profileId: string;
      if (existingProfile.length > 0) {
        profileId = existingProfile[0].id;
        await this.dataSource.query(
          `UPDATE "${schema}"."profiles" SET "permitAll" = true WHERE "id" = $1`,
          [profileId],
        );
      } else {
        const inserted = await this.dataSource.query(
          `INSERT INTO "${schema}"."profiles" ("name", "modules", "permitAll")
             VALUES ($1, '{}', true) RETURNING "id"`,
          [ADMIN_PROFILE_NAME],
        );
        profileId = inserted[0].id;
      }

      // Link every owner to the admin profile.
      const owners = await this.dataSource.query(
        `SELECT DISTINCT "userId" FROM "${schema}"."enterprise_members"
           WHERE "role" = 'OWNER' AND "deletedAt" IS NULL`,
      );

      for (const owner of owners as { userId: string }[]) {
        await this.dataSource.query(
          `INSERT INTO "${schema}"."pivot_user_profiles" ("userId", "profileId")
             VALUES ($1, $2)
             ON CONFLICT ("userId", "profileId") DO NOTHING`,
          [owner.userId, profileId],
        );
      }

      this.logger.log(
        `  ${schema}: linked ${owners.length} owner(s) to the admin profile`,
      );
    }

    this.logger.log('Tenant admin profiles ensured');
  }

  /**
   * Template first, then every `tenant_<id>` — no user/plan seeding.
   * Use to align schemas after pulling new tenant migrations.
   */
  async runAllTenantMigrationsFromSeed() {
    await this.seedTenantTemplate();
    await this.migrateAllRegisteredTenantSchemas();
  }

  async seedAll() {
    await this.seedTenantTemplate();
    await this.seedUser();
    await this.migrateAllRegisteredTenantSchemas();
    await this.seedTenantAdminProfiles();
  }
}
