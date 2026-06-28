import { Module } from '@nestjs/common';
import { StartUserTenantController } from './controllers/start-user-tenant.controller';
import { StartUserTenantService } from './services/start-user-tenant.service';

@Module({
  controllers: [StartUserTenantController],
  providers: [StartUserTenantService],
  exports: [StartUserTenantService],
})
export class StartUserTenantModule {}
