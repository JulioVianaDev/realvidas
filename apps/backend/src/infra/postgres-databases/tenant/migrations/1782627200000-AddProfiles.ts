import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds `profiles` (named permission roles) and `pivot_user_profiles`
 * (user ↔ profile links) to every tenant schema. Runs after InitTenantSchema
 * via runTenantMigrationsInSchema — never in public.
 */
export class AddProfiles1782627200000 implements MigrationInterface {
  name = 'AddProfiles1782627200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- profiles ---
    await queryRunner.query(`
      CREATE TABLE "profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "modules" text[] NOT NULL DEFAULT '{}',
        "permitAll" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "PK_profiles" PRIMARY KEY ("id")
      )
    `);

    // --- pivot_user_profiles ---
    await queryRunner.query(`
      CREATE TABLE "pivot_user_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "profileId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_pivot_user_profiles_user_profile" UNIQUE ("userId", "profileId"),
        CONSTRAINT "PK_pivot_user_profiles" PRIMARY KEY ("id"),
        CONSTRAINT "FK_pivot_user_profiles_profile" FOREIGN KEY ("profileId")
          REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_pivot_user_profiles_userId" ON "pivot_user_profiles" ("userId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_pivot_user_profiles_userId"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "pivot_user_profiles"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "profiles"`);
  }
}
