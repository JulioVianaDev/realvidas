import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial main (public) schema. Covers every entity currently registered in
 * mainConfig:
 *   - users
 *   - tenants
 *   - url_shorteners
 *   - pivot_relation_user_tenant
 *
 * users.currentTenantViewId and tenants.createdByUserId reference each other, so
 * both tables are created first and the cross FKs are added afterwards.
 */
export class InitMainSchema1782627136000 implements MigrationInterface {
  name = 'InitMainSchema1782627136000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public`,
    );

    // --- Enum types ---
    await queryRunner.query(
      `CREATE TYPE "users_role_enum" AS ENUM('ADMIN', 'USER', 'SELLER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "pivot_relation_user_tenant_role_enum" AS ENUM('OWNER', 'ADMIN', 'MEMBER')`,
    );

    // --- users (cross FK to tenants added after tenants exists) ---
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "cpf" character varying,
        "password" character varying,
        "imageUrl" character varying,
        "role" "users_role_enum" NOT NULL DEFAULT 'USER',
        "age" integer,
        "language" character varying(10),
        "theme" character varying(16),
        "email_confirmed" boolean NOT NULL DEFAULT false,
        "currentTenantViewId" uuid,
        "register_completed" boolean NOT NULL DEFAULT false,
        "auth_codes" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_cpf" UNIQUE ("cpf"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // --- tenants ---
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdByUserId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tenants" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tenants_createdByUser" FOREIGN KEY ("createdByUserId")
          REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Now wire users -> tenants (currentTenantView).
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD CONSTRAINT "FK_users_currentTenantView" FOREIGN KEY ("currentTenantViewId")
          REFERENCES "tenants" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // --- url_shorteners ---
    await queryRunner.query(`
      CREATE TABLE "url_shorteners" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "path" character varying(40) NOT NULL,
        "tenantId" uuid NOT NULL,
        "enterpriseId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "PK_url_shorteners" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_url_shorteners_path" ON "url_shorteners" ("path") WHERE "deletedAt" IS NULL`,
    );

    // --- pivot_relation_user_tenant ---
    await queryRunner.query(`
      CREATE TABLE "pivot_relation_user_tenant" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "tenantId" uuid NOT NULL,
        "role" "pivot_relation_user_tenant_role_enum" NOT NULL DEFAULT 'MEMBER',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_pivot_relation_user_tenant" PRIMARY KEY ("id"),
        CONSTRAINT "FK_pivot_user_tenant_user" FOREIGN KEY ("userId")
          REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_pivot_user_tenant_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS "pivot_relation_user_tenant"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_url_shorteners_path"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "url_shorteners"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_users_currentTenantView"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "tenants"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "pivot_relation_user_tenant_role_enum"`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum"`);
  }
}
