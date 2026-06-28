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

/**
 * Guard for per-enterprise (tenant) schema access.
 * Use on endpoints that operate on tenant data: calendars, events, assistants, etc.
 *
 * 1. Ensures user is authenticated (request.user).
 * 2. Resolves enterpriseId from params, query or body.
 * 3. Verifies user is a member of that enterprise (SAAS DB check).
 * 4. Sets request.enterpriseId for controllers/services and tenant repositories.
 *
 * Apply after AuthGuard('jwt'). Use @EnterpriseId() to get enterpriseId in handlers.
 *
 * @example
 * @UseGuards(AuthGuard('jwt'), EnterpriseSchemaGuard)
 * async getCalendars(@EnterpriseId() enterpriseId: string) { ... }
 */
@Injectable()
export class EnterpriseSchemaGuard implements CanActivate {
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

    const enterpriseId =
      request.params.enterpriseId ||
      request.query.enterpriseId ||
      request.body?.enterpriseId;

    if (!enterpriseId) {
      throw new BadRequestException('Enterprise ID is required');
    }

    const isMember = await this.enterpriseRepository.checkUserIsMember(
      enterpriseId,
      user.id,
    );

    if (!isMember) {
      throw new ForbiddenException(
        'You do not have access to this enterprise',
      );
    }

    request.enterpriseId = enterpriseId;
    return true;
  }
}
