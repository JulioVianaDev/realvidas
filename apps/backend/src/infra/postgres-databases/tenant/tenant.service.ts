import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TenantEntity } from '../main/entities/tenant.entity';
import { tenantConfig } from './tenant.config.orm';
import { TENANT_TEMPLATE_SCHEMA } from './tenant-template.constants';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findAll(): Promise<TenantEntity[]> {
    return this.dataSource.getRepository(TenantEntity).find();
  }

  async findByUserId(userId: string): Promise<TenantEntity | null> {
    return this.dataSource.getRepository(TenantEntity).findOne({
      where: { createdByUserId: userId },
    });
  }

  async createTenant(createdByUserId: string): Promise<TenantEntity> {
    const tenant = new TenantEntity();
    tenant.createdByUserId = createdByUserId;
    await this.dataSource.getRepository(TenantEntity).save(tenant);

    const schemaName = `tenant_${tenant.id}`;

    await this.cloneTemplateSchema(schemaName);

    this.logger.log(`Tenant schema "${schemaName}" created from template`);
    return tenant;
  }

  /**
   * Clone the tenant_template schema by creating a fresh schema and running
   * migrations. This is reliable because it uses the same migration path
   * that created the template, avoiding issues with manual DDL copying.
   */
  private async cloneTemplateSchema(newSchemaName: string) {
    const templateExists = await this.dataSource.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
      [TENANT_TEMPLATE_SCHEMA],
    );

    if (templateExists.length === 0) {
      throw new Error(
        `Template schema "${TENANT_TEMPLATE_SCHEMA}" does not exist. Run the seed first.`,
      );
    }

    await this.dataSource.query(`CREATE SCHEMA "${newSchemaName}"`);

    const tenantDataSource = new DataSource({
      ...tenantConfig,
      schema: newSchemaName,
    } as DataSourceOptions);

    await tenantDataSource.initialize();
    try {
      await tenantDataSource.query(
        `SET search_path TO "${newSchemaName}", public`,
      );
      await tenantDataSource.runMigrations();
    } finally {
      await tenantDataSource.destroy();
    }

    this.logger.log(`Schema "${newSchemaName}" created with migrations applied`);
  }
}
