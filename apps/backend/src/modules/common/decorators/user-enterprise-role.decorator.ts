import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract user's enterprise role from request
 * Can be used after EnterpriseRoleGuard
 * @example
 * async getCalendars(@UserEnterpriseRole() role: string) { ... }
 */
export const UserEnterpriseRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.userEnterpriseRole;
  },
);

