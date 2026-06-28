import { Injectable, Inject } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TENANT_CONNECTION } from '../tenant.module';

/**
 * Base for TypeORM repositories that use tenant-scoped EntityManager.
 * Throws if no tenant context (TENANT_CONNECTION is null).
 */
@Injectable()
export abstract class BaseTypeOrmRepository {
  constructor(
    @Inject(TENANT_CONNECTION)
    protected readonly entityManager: EntityManager | null,
  ) {}

  protected getManager(): EntityManager {
    if (!this.entityManager) {
      throw new Error(
        'No tenant context. Authenticate with JWT and ensure users.currentTenantViewId is set.',
      );
    }
    return this.entityManager;
  }

  /** Postgres schema for the current tenant (e.g. tenant_<uuid>). */
  protected get tenantSchema(): string {
    const options = this.getManager().connection.options as {
      schema?: string;
    };
    const schema = options.schema;
    if (typeof schema !== 'string' || !schema) {
      throw new Error(
        'Tenant DataSource has no schema. TENANT_CONNECTION must use getTenantConnection().',
      );
    }
    return schema;
  }

  /** Qualify a table name for raw SQL fragments in the tenant schema. */
  protected qualifyTable(tableName: string): string {
    return `"${this.tenantSchema}"."${tableName}"`;
  }
}
