import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial tenant schema. Runs inside each tenant schema (tenant_template,
 * tenant_<uuid>) via runTenantMigrationsInSchema — never in public.
 *
 * Creates the tables for every entity currently registered in tenant.config.orm:
 *   - enterprises
 *   - enterprise_members
 *   - enterprise_invitations
 *   - files
 *
 * Enum types are created unqualified and resolve into the active tenant schema
 * because the runner sets `search_path TO "<schema>", public`. uuid_generate_v4()
 * comes from the shared uuid-ossp extension in public.
 */
export class InitTenantSchema1782627137000 implements MigrationInterface {
  name = 'InitTenantSchema1782627137000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Pin to public: new tenants re-run this migration with search_path
    // "<schema>", public, so uuid_generate_v4() must live in public to resolve
    // from every tenant schema (not in whatever schema happens to be current).
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public`,
    );

    // --- Enum types ---
    await queryRunner.query(
      `CREATE TYPE "enterprise_members_role_enum" AS ENUM('OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'SELLER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "enterprise_invitations_role_enum" AS ENUM('OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'SELLER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "enterprise_invitations_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED')`,
    );

    // --- enterprises ---
    await queryRunner.query(`
      CREATE TABLE "enterprises" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "cpf" character varying,
        "cnpj" character varying,
        "email" character varying,
        "description" character varying(2024),
        "phoneId" uuid,
        "imageUrl" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "ownerId" uuid NOT NULL,
        "mainGoogleEmail" character varying,
        "googleRefreshToken" character varying,
        "googleAccessToken" character varying,
        "tokenExpiresAt" TIMESTAMP,
        "timezone" character varying,
        "shortPath" character varying(40),
        "needCpfInCatalog" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "UQ_enterprises_cpf" UNIQUE ("cpf"),
        CONSTRAINT "UQ_enterprises_cnpj" UNIQUE ("cnpj"),
        CONSTRAINT "UQ_enterprises_phoneId" UNIQUE ("phoneId"),
        CONSTRAINT "UQ_enterprises_mainGoogleEmail" UNIQUE ("mainGoogleEmail"),
        CONSTRAINT "PK_enterprises" PRIMARY KEY ("id")
      )
    `);

    // --- enterprise_members ---
    await queryRunner.query(`
      CREATE TABLE "enterprise_members" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "enterpriseId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "role" "enterprise_members_role_enum" NOT NULL DEFAULT 'EMPLOYEE',
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "UQ_enterprise_members_enterprise_user" UNIQUE ("enterpriseId", "userId"),
        CONSTRAINT "PK_enterprise_members" PRIMARY KEY ("id"),
        CONSTRAINT "FK_enterprise_members_enterprise" FOREIGN KEY ("enterpriseId")
          REFERENCES "enterprises" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // --- enterprise_invitations ---
    await queryRunner.query(`
      CREATE TABLE "enterprise_invitations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "enterpriseId" uuid NOT NULL,
        "email" character varying NOT NULL,
        "role" "enterprise_invitations_role_enum" NOT NULL DEFAULT 'EMPLOYEE',
        "token" character varying NOT NULL,
        "status" "enterprise_invitations_status_enum" NOT NULL DEFAULT 'PENDING',
        "invitedById" uuid NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_enterprise_invitations_token" UNIQUE ("token"),
        CONSTRAINT "UQ_enterprise_invitations_enterprise_email" UNIQUE ("enterpriseId", "email"),
        CONSTRAINT "PK_enterprise_invitations" PRIMARY KEY ("id"),
        CONSTRAINT "FK_enterprise_invitations_enterprise" FOREIGN KEY ("enterpriseId")
          REFERENCES "enterprises" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // --- files ---
    await queryRunner.query(`
      CREATE TABLE "files" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "hash" character varying NOT NULL,
        "extension" character varying NOT NULL,
        "originalName" character varying NOT NULL,
        "module" character varying NOT NULL,
        "userId" uuid,
        "isReceived" boolean NOT NULL DEFAULT false,
        "fileSize" bigint NOT NULL DEFAULT 0,
        "type" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "PK_files" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_files_hash" ON "files" ("hash")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_files_hash"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "files"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "enterprise_invitations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "enterprise_members"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "enterprises"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "enterprise_invitations_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "enterprise_invitations_role_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "enterprise_members_role_enum"`,
    );
  }
}
