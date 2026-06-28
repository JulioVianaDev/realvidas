import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract enterpriseId from request
 * Can be used after TenantIsolationGuard
 * @example
 * async getCalendars(@EnterpriseId() enterpriseId: string) { ... }
 */
export const EnterpriseId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.enterpriseId;
  },
);

