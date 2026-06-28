import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IEnterpriseContractRepository } from 'src/infra/postgres-databases/tenant/repositories/enterprise/enterprise.contract.repository';
import { REPOSITORY_TOKENS_TENANT } from 'src/infra/postgres-databases/tenant/repository-tokens';

@Injectable()
export class EnterpriseRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(REPOSITORY_TOKENS_TENANT.ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseContractRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'enterpriseRoles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const enterpriseId =
      request.enterpriseId ||
      request.params.enterpriseId ||
      request.query.enterpriseId ||
      request.body?.enterpriseId;

    if (!enterpriseId) {
      throw new ForbiddenException('Enterprise ID is required');
    }

    const userRole =
      await this.enterpriseRepository.getUserRoleInEnterprise(
        enterpriseId,
        user.id,
      );

    if (!userRole || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `You do not have the required permissions. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    // Add user role to request for use in controllers/services
    request.userEnterpriseRole = userRole;

    return true;
  }
}
