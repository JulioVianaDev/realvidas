import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

/**
 * Resolves the active tenant from nestjs-cls (set by TenantClsSetupService).
 * Never read tenantId from the HTTP request object — CLS is the source of truth.
 */
@Injectable()
export class TenantContextService {
  constructor(private readonly cls: ClsService) {}

  getTenantId(): string | undefined {
    return this.cls.get<string>('tenantId');
  }

  requireTenantId(): string {
    const tenantId = this.getTenantId();
    if (!tenantId) {
      throw new ForbiddenException(
        'No tenant context. Ensure your session has a current tenant.',
      );
    }
    return tenantId;
  }

  requireTenantIdOrBadRequest(): string {
    const tenantId = this.getTenantId();
    if (!tenantId) {
      throw new BadRequestException(
        'No tenant workspace is active for this session. Select a tenant in the app, then retry.',
      );
    }
    return tenantId;
  }
}
