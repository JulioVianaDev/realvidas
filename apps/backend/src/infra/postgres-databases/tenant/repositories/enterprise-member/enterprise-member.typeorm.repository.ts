import { Injectable, Inject } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { IGetEnterpriseMembersParams } from '@global-types/params/enterprise-member.params';
import {
  IGetEnterpriseMembersResponse,
  IGetEnterpriseMemberByIdResponse,
  IAddEnterpriseMemberResponse,
  IUpdateEnterpriseMemberResponse,
  IDeleteEnterpriseMemberResponse,
} from '@global-types/responses/enterprise-member.response';
import {
  AddEnterpriseMemberDto,
  UpdateEnterpriseMemberDto,
} from 'src/modules/enterprise-member/dto/enterprise-member.dto';
import { EnterpriseMemberEntity } from '../../entities/enterprise-member.entity';
import { TENANT_CONNECTION } from '../../tenant.module';
import { IEnterpriseMemberContractRepository } from './enterprise-member.contract.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseTypeOrmRepository } from '../base.typeorm.repository';

@Injectable()
export class EnterpriseMemberTypeOrmRepository
  extends BaseTypeOrmRepository
  implements IEnterpriseMemberContractRepository
{
  private repo: Repository<EnterpriseMemberEntity>;
  constructor(
    @Inject(TENANT_CONNECTION)
    entityManager: EntityManager | null,
  ) {
    super(entityManager);
    this.repo = this.getManager().getRepository(
      EnterpriseMemberEntity,
    );
  }

  async getAllMembers(
    params: IGetEnterpriseMembersParams,
  ): Promise<IGetEnterpriseMembersResponse> {
    const { enterpriseId, page = 1, pageSize = 10 } = params;
    const [data, total] = await this.repo.findAndCount({
      where: { enterpriseId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['enterprise'],
    });
    return {
      data: data as unknown as IGetEnterpriseMembersResponse['data'],
      metadata: {
        page,
        total,
        hasNextPage: total > page * pageSize,
        hasPreviousPage: page > 1,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  }

  async getMemberById(
    id: string,
  ): Promise<IGetEnterpriseMemberByIdResponse> {
    return this.repo.findOne({
      where: { id },
      relations: ['enterprise'],
    }) as unknown as Promise<IGetEnterpriseMemberByIdResponse>;
  }

  async getMemberByUserAndEnterprise(
    enterpriseId: string,
    userId: string,
  ): Promise<IGetEnterpriseMemberByIdResponse> {
    return this.repo.findOne({
      where: { enterpriseId, userId },
      relations: ['enterprise'],
    }) as unknown as Promise<IGetEnterpriseMemberByIdResponse>;
  }

  async addMember(
    enterpriseId: string,
    data: AddEnterpriseMemberDto,
  ): Promise<IAddEnterpriseMemberResponse> {
    const member = this.repo.create({
      ...data,
      enterpriseId,
      role: data.role as any,
    });
    const saved = await this.repo.save(member);
    return saved as unknown as IAddEnterpriseMemberResponse;
  }

  async updateMember(
    id: string,
    data: UpdateEnterpriseMemberDto,
  ): Promise<IUpdateEnterpriseMemberResponse> {
    await this.repo.update(
      id,
      data as Partial<EnterpriseMemberEntity>,
    );
    return this.repo.findOne({
      where: { id },
      relations: ['enterprise'],
    }) as unknown as Promise<IUpdateEnterpriseMemberResponse>;
  }

  async removeMember(
    id: string,
  ): Promise<IDeleteEnterpriseMemberResponse> {
    await this.repo.softDelete(id);
    return { success: true, id };
  }
}
