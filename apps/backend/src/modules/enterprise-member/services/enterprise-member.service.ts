import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IEnterpriseMemberContractRepository } from '../../../infra/postgres-databases/tenant/repositories/enterprise-member/enterprise-member.contract.repository';
import {
  AddEnterpriseMemberDto,
  UpdateEnterpriseMemberDto,
  GetEnterpriseMembersDto,
} from '../dto/enterprise-member.dto';
import {
  IGetEnterpriseMembersResponse,
  IGetEnterpriseMemberByIdResponse,
  IAddEnterpriseMemberResponse,
  IUpdateEnterpriseMemberResponse,
  IDeleteEnterpriseMemberResponse,
} from '@global-types/responses/enterprise-member.response';
import { IEnterpriseContractRepository } from 'src/infra/postgres-databases/tenant/repositories/enterprise/enterprise.contract.repository';
import { REPOSITORY_TOKENS_TENANT } from 'src/infra';

@Injectable()
export class EnterpriseMemberService {
  constructor(
    @Inject(REPOSITORY_TOKENS_TENANT.ENTERPRISE_MEMBER_REPOSITORY)
    private readonly memberRepository: IEnterpriseMemberContractRepository,
    @Inject(REPOSITORY_TOKENS_TENANT.ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseContractRepository,
  ) {}

  async getAllMembers(
    params: GetEnterpriseMembersDto,
    userId: string,
  ): Promise<IGetEnterpriseMembersResponse> {
    // Check if user is member of enterprise
    const isMember =
      await this.enterpriseRepository.checkUserIsMember(
        params.enterpriseId,
        userId,
      );

    if (!isMember) {
      throw new ForbiddenException(
        'You are not a member of this enterprise',
      );
    }

    return this.memberRepository.getAllMembers(params);
  }

  async getMemberById(
    id: string,
    userId: string,
  ): Promise<IGetEnterpriseMemberByIdResponse> {
    const member = await this.memberRepository.getMemberById(id);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Check if user has access to this enterprise
    const isMember =
      await this.enterpriseRepository.checkUserIsMember(
        member.enterpriseId,
        userId,
      );

    if (!isMember) {
      throw new ForbiddenException('Access denied');
    }

    return member;
  }

  async addMember(
    enterpriseId: string,
    userId: string,
    data: AddEnterpriseMemberDto,
  ): Promise<IAddEnterpriseMemberResponse> {
    // Check if user has permission (OWNER, ADMIN, or MANAGER)
    const userRole =
      await this.enterpriseRepository.getUserRoleInEnterprise(
        enterpriseId,
        userId,
      );

    if (
      !userRole ||
      !['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)
    ) {
      throw new ForbiddenException(
        'You do not have permission to add members',
      );
    }

    // Check if user already is a member
    const existingMember =
      await this.memberRepository.getMemberByUserAndEnterprise(
        enterpriseId,
        data.userId,
      );

    if (existingMember) {
      throw new BadRequestException(
        'User is already a member of this enterprise',
      );
    }

    return this.memberRepository.addMember(enterpriseId, data);
  }

  async updateMember(
    id: string,
    userId: string,
    data: UpdateEnterpriseMemberDto,
  ): Promise<IUpdateEnterpriseMemberResponse> {
    const member = await this.memberRepository.getMemberById(id);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Check if user has permission (OWNER, ADMIN, or MANAGER)
    const userRole =
      await this.enterpriseRepository.getUserRoleInEnterprise(
        member.enterpriseId,
        userId,
      );

    if (
      !userRole ||
      !['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)
    ) {
      throw new ForbiddenException(
        'You do not have permission to update members',
      );
    }

    // Cannot downgrade owner role
    if (member.role === 'OWNER' && data.role && data.role !== 'OWNER') {
      throw new BadRequestException(
        'Cannot change owner role. Use transfer ownership instead.',
      );
    }

    return this.memberRepository.updateMember(id, data);
  }

  async removeMember(
    id: string,
    userId: string,
  ): Promise<IDeleteEnterpriseMemberResponse> {
    const member = await this.memberRepository.getMemberById(id);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Check if user has permission (OWNER, ADMIN, or MANAGER)
    const userRole =
      await this.enterpriseRepository.getUserRoleInEnterprise(
        member.enterpriseId,
        userId,
      );

    if (
      !userRole ||
      !['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)
    ) {
      throw new ForbiddenException(
        'You do not have permission to remove members',
      );
    }

    // Cannot remove owner
    if (member.role === 'OWNER') {
      throw new BadRequestException(
        'Cannot remove owner. Transfer ownership first.',
      );
    }

    return this.memberRepository.removeMember(id);
  }
}

