import { Module } from '@nestjs/common';
import { TenantUserService } from './services/tenant-user.service';
import { TenantUserController } from './controllers/tenant-user.controller';

/**
 * Manages the users that belong to the current tenant: list, create employees,
 * edit, unlink, and link them to permission profiles. Spans the main DB (users,
 * tenant pivot) and the tenant DB (profile links). Repositories are provided
 * globally by PostgresDatabaseModule.
 */
@Module({
  providers: [TenantUserService],
  controllers: [TenantUserController],
  exports: [TenantUserService],
})
export class TenantUserModule {}
