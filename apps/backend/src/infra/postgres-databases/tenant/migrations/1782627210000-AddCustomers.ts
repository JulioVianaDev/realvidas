import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the `customers` (B2B "Cliente") table to every tenant schema. Runs after
 * the previous tenant migrations via runTenantMigrationsInSchema — never in
 * public. uuid_generate_v4() resolves from the shared public extension.
 */
export class AddCustomers1782627210000 implements MigrationInterface {
  name = 'AddCustomers1782627210000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "razaoSocial" character varying NOT NULL,
        "nomeFantasia" character varying,
        "cnpjCpf" character varying,
        "responsavel" character varying,
        "email" character varying,
        "telefone" character varying,
        "celular" character varying,
        "endereco" character varying,
        "complemento" character varying,
        "bairro" character varying,
        "cidade" character varying,
        "cep" character varying,
        "estado" character varying(2),
        "limiteTolerancia" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "PK_customers" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "customers"`);
  }
}
