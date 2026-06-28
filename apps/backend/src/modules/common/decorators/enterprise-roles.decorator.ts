import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to set required enterprise roles for an endpoint
 * @param roles - Array of roles required (OWNER, ADMIN, MANAGER, EMPLOYEE, SELLER, VIEWER)
 * @example
 * @EnterpriseRoles('OWNER', 'ADMIN')
 * async createCalendar() { ... }
 */
export const EnterpriseRoles = (...roles: string[]) =>
  SetMetadata('enterpriseRoles', roles);

