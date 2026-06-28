import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the `phone_country` column to `customers` (ISO2 country code for the
 * phone flag). Runs in every tenant schema via runTenantMigrationsInSchema.
 */
export class AddCustomerPhoneCountry1782627220000
  implements MigrationInterface
{
  name = 'AddCustomerPhoneCountry1782627220000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "phone_country" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN IF EXISTS "phone_country"`,
    );
  }
}
