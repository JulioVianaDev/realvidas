import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { typeOrmRepositoryMainProviders } from './main/providers/main.providers';
import { typeOrmRepositoryTenantProviders } from './tenant/providers/tenant.providers';
import { REPOSITORY_TOKENS_TENANT } from 'src/infra/postgres-databases/tenant/repository-tokens';
import { TenancyModule } from './tenant/tenant.module';
import { REPOSITORY_TOKENS_MAIN } from './main/repository-tokens';
import { MainModule } from './main/main.module';

/**
 * PostgresDatabaseModule - TypeORM-based database module for multi-tenant setup.
 *
 * Provides TypeORM repository implementations that use TENANT_CONNECTION (EntityManager)
 * for tenant-scoped queries.
 *
 * Tenant id is set on CLS via `ClsModule` `middleware.setup` (TenantClsSetupService),
 * not a separate Nest middleware, so async work stays inside CLS `run()`.
 */
@Global()
@Module({
  imports: [ConfigModule, MainModule, TenancyModule],
  providers: [
    ...typeOrmRepositoryMainProviders,
    ...typeOrmRepositoryTenantProviders,
  ],
  exports: [
    ...Object.values(REPOSITORY_TOKENS_MAIN),
    ...Object.values(REPOSITORY_TOKENS_TENANT),
  ],
})
export class PostgresDatabaseModule {}
