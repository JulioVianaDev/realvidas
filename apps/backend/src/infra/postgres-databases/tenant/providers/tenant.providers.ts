import { Provider, Scope } from '@nestjs/common';
import { REPOSITORY_TOKENS_TENANT } from 'src/infra/postgres-databases/tenant/repository-tokens';

// TypeORM repository implementations - inject TENANT_CONNECTION (EntityManager)
import { EnterpriseMemberTypeOrmRepository } from '../repositories/enterprise-member/enterprise-member.typeorm.repository';
import { EnterpriseTypeOrmRepository } from '../repositories/enterprise/enterprise.typeorm.repository';
import { FileTypeOrmRepository } from '../repositories/file/file.typeorm.repository';
import { ProfileTypeOrmRepository } from '../repositories/profile/profile.typeorm.repository';
import { CustomerTypeOrmRepository } from '../repositories/customer/customer.typeorm.repository';
/**
 * TypeORM repository providers - use TENANT_CONNECTION (EntityManager) for tenant-scoped queries.
 * Request-scoped because TENANT_CONNECTION is per-request.
 * Replace Prisma providers in DatabaseModule when migrating to TypeORM multi-tenant.
 */
export const typeOrmRepositoryTenantProviders: Provider[] = [
  {
    provide: REPOSITORY_TOKENS_TENANT.ENTERPRISE_REPOSITORY,
    useClass: EnterpriseTypeOrmRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: REPOSITORY_TOKENS_TENANT.ENTERPRISE_MEMBER_REPOSITORY,
    useClass: EnterpriseMemberTypeOrmRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: REPOSITORY_TOKENS_TENANT.PROFILE_REPOSITORY,
    useClass: ProfileTypeOrmRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: REPOSITORY_TOKENS_TENANT.CUSTOMER_REPOSITORY,
    useClass: CustomerTypeOrmRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: REPOSITORY_TOKENS_TENANT.FILE_REPOSITORY,
    useClass: FileTypeOrmRepository,
    scope: Scope.REQUEST,
  },
];
