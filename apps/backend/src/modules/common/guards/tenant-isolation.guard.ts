import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { IEnterpriseContractRepository } from 'src/infra/postgres-databases/tenant/repositories/enterprise/enterprise.contract.repository';
import { REPOSITORY_TOKENS_TENANT } from 'src/infra/postgres-databases/tenant/repository-tokens';

@Injectable()
export class TenantIsolationGuard implements CanActivate {
  constructor(
    @Inject(REPOSITORY_TOKENS_TENANT.ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseContractRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('User not authenticated');
    }

    // Extract enterpriseId from params or query
    const enterpriseId =
      request.params.enterpriseId ||
      request.query.enterpriseId ||
      request.body?.enterpriseId;

    if (!enterpriseId) {
      throw new BadRequestException('Enterprise ID is required');
    }

    // Check if user is a member of the enterprise
    const isMember =
      await this.enterpriseRepository.checkUserIsMember(
        enterpriseId,
        user.id,
      );

    if (!isMember) {
      throw new ForbiddenException(
        'You do not have access to this enterprise',
      );
    }

    // Add enterpriseId to request for use in controllers/services
    request.enterpriseId = enterpriseId;

    return true;
  }
}
