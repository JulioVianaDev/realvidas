import { Provider, Scope } from '@nestjs/common';
import { REPOSITORY_TOKENS_MAIN } from '../repository-tokens';

// TypeORM repository implementations
import { UserTypeOrmRepository } from '../repositories/user/user.typeorm.repository';
import { TenantAdminTypeOrmRepository } from '../repositories/tenant-admin/tenant-admin.typeorm.repository';
import { UrlShortenerTypeOrmRepository } from '../repositories/url-shortener/url-shortener.typeorm.repository';

/**
 * TypeORM repository providers - use TENANT_CONNECTION (EntityManager) for tenant-scoped queries.
 * Request-scoped because TENANT_CONNECTION is per-request.
 * Replace Prisma providers in DatabaseModule when migrating to TypeORM multi-tenant.
 */
export const typeOrmRepositoryMainProviders: Provider[] = [
  {
    provide: REPOSITORY_TOKENS_MAIN.USER_REPOSITORY,
    useClass: UserTypeOrmRepository,
    scope: Scope.REQUEST,
  },

  {
    provide: REPOSITORY_TOKENS_MAIN.TENANT_ADMIN_REPOSITORY,
    useClass: TenantAdminTypeOrmRepository,
    // Singleton: uses main TypeORM DataSource + getTenantConnection(), not request-scoped TENANT_CONNECTION.
    // REQUEST scope here made WebhookConsumerService non-static so Nest never ran its onModuleInit.
  },
  {
    provide: REPOSITORY_TOKENS_MAIN.URL_SHORTENER_REPOSITORY,
    useClass: UrlShortenerTypeOrmRepository,
    scope: Scope.REQUEST,
  },
];
