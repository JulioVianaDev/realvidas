import { Injectable, Inject } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import {
  IGetEnterprisesParams,
  IGetMyEnterprisesParams,
} from '@global-types/params/enterprise.params';
import {
  IGetEnterprisesResponse,
  IGetEnterpriseByIdResponse,
  IGetMyEnterprisesResponse,
  ICreateEnterpriseResponse,
  IUpdateEnterpriseResponse,
  IDeleteEnterpriseResponse,
  ITransferOwnershipResponse,
} from '@global-types/responses/enterprise.response';
import {
  CreateEnterpriseDto,
  UpdateEnterpriseDto,
  UpdateEnterpriseGoogleTokensDto,
} from 'src/modules/enterprise/dto/enterprise.dto';
import { BaseTypeOrmRepository } from '../base.typeorm.repository';
import { EnterpriseEntity } from '../../entities/enterprise.entity';
import { EnterpriseMemberEntity } from '../../entities/enterprise-member.entity';
import { TENANT_CONNECTION } from '../../tenant.module';
import { IEnterpriseContractRepository } from './enterprise.contract.repository';

@Injectable()
export class EnterpriseTypeOrmRepository
  extends BaseTypeOrmRepository
  implements IEnterpriseContractRepository
{
  constructor(
    @Inject(TENANT_CONNECTION)
    entityManager: EntityManager | null,
  ) {
    super(entityManager);
  }

  private get enterpriseRepo() {
    return this.getManager().getRepository(EnterpriseEntity);
  }

  private get memberRepo() {
    return this.getManager().getRepository(EnterpriseMemberEntity);
  }

  async createEnterprise(
    ownerId: string,
    data: CreateEnterpriseDto,
  ): Promise<ICreateEnterpriseResponse> {
    const enterprise = this.enterpriseRepo.create({ ...data, ownerId });
    return this.enterpriseRepo.save(
      enterprise,
    ) as unknown as Promise<ICreateEnterpriseResponse>;
  }

  async getAllEnterprises(
    params: IGetEnterprisesParams,
  ): Promise<IGetEnterprisesResponse> {
    const { page = 1, pageSize = 10 } = params;
    const [data, total] = await this.enterpriseRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
    return {
      data: data as any,
      metadata: {
        page,
        total,
        hasNextPage: total > page * pageSize,
        hasPreviousPage: page > 1,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  }

  async getEnterpriseById(
    id: string,
  ): Promise<IGetEnterpriseByIdResponse> {
    return this.enterpriseRepo.findOne({
      where: { id },
    }) as unknown as Promise<IGetEnterpriseByIdResponse>;
  }

  async getMyEnterprises(
    userId: string,
    params: IGetMyEnterprisesParams,
  ): Promise<IGetMyEnterprisesResponse> {
    const members = await this.memberRepo.find({
      where: { userId },
      relations: ['enterprise'],
    });
    return {
      data: members.map((m) => m.enterprise).filter(Boolean) as any,
      metadata: {
        page: 1,
        total: members.length,
        hasNextPage: false,
        hasPreviousPage: false,
        lastPage: 1,
      },
    };
  }

  async updateEnterprise(
    id: string,
    data: UpdateEnterpriseDto,
  ): Promise<IUpdateEnterpriseResponse> {
    await this.enterpriseRepo.update(
      id,
      data as unknown as Partial<EnterpriseEntity>,
    );
    return this.enterpriseRepo.findOne({
      where: { id },
    }) as unknown as Promise<IUpdateEnterpriseResponse>;
  }

  async deleteEnterprise(
    id: string,
  ): Promise<IDeleteEnterpriseResponse> {
    await this.enterpriseRepo.softDelete(id);
    return { success: true, id };
  }

  async transferOwnership(
    enterpriseId: string,
    newOwnerId: string,
  ): Promise<ITransferOwnershipResponse> {
    const current = await this.enterpriseRepo.findOne({
      where: { id: enterpriseId },
    });
    if (!current) throw new Error('Enterprise not found');
    const oldOwnerId = current.ownerId;
    await this.enterpriseRepo.update(enterpriseId, {
      ownerId: newOwnerId,
    } as Partial<EnterpriseEntity>);
    const members = await this.memberRepo.find({ where: { enterpriseId } });
    for (const m of members) {
      if (m.userId === newOwnerId) {
        await this.memberRepo.update(m.id, { role: 'OWNER' as any });
      } else if (m.role === 'OWNER') {
        await this.memberRepo.update(m.id, { role: 'ADMIN' as any });
      }
    }
    const enterprise = await this.getEnterpriseById(enterpriseId);
    return {
      success: true,
      enterprise: enterprise as any,
      oldOwnerId,
      newOwnerId,
    };
  }

  async updateGoogleTokens(
    enterpriseId: string,
    data: UpdateEnterpriseGoogleTokensDto,
  ): Promise<IUpdateEnterpriseResponse> {
    await this.enterpriseRepo.update(
      enterpriseId,
      data as Partial<EnterpriseEntity>,
    );
    return this.enterpriseRepo.findOne({
      where: { id: enterpriseId },
    }) as unknown as Promise<IUpdateEnterpriseResponse>;
  }

  async checkUserIsMember(
    enterpriseId: string,
    userId: string,
  ): Promise<boolean> {
    const count = await this.memberRepo.count({
      where: { enterpriseId, userId },
    });
    return count > 0;
  }

  async checkUserIsOwner(
    enterpriseId: string,
    userId: string,
  ): Promise<boolean> {
    const enterprise = await this.enterpriseRepo.findOne({
      where: { id: enterpriseId, ownerId: userId },
    });
    return !!enterprise;
  }

  async getUserRoleInEnterprise(
    enterpriseId: string,
    userId: string,
  ): Promise<string | null> {
    const member = await this.memberRepo.findOne({
      where: { enterpriseId, userId },
    });
    return member?.role ?? null;
  }
}
