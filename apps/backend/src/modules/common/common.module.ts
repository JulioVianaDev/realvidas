import { Module, Global } from '@nestjs/common';
import { TenantIsolationGuard } from './guards/tenant-isolation.guard';
import { EnterpriseRoleGuard } from './guards/enterprise-role.guard';
import { BackendTranslatorService } from './services/backend-translator.service';
import { TenantContextService } from './services/tenant-context.service';

@Global()
@Module({
  imports: [],
  providers: [
    TenantIsolationGuard,
    EnterpriseRoleGuard,
    BackendTranslatorService,
    TenantContextService,
  ],
  exports: [
    TenantIsolationGuard,
    EnterpriseRoleGuard,
    BackendTranslatorService,
    TenantContextService,
  ],
})
export class CommonModule {}
