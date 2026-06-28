import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TenantEntity } from '../../entities/tenant.entity';
import {
  EnterpriseOption,
  ITenantAdminContractRepository,
  TenantOption,
} from './tenant-admin.contract.repository';
import { UserEntity } from '../../entities/user.entity';
import { getTenantConnection } from '../../../tenant/utils';
import { EnterpriseEntity } from '../../../tenant/entities/enterprise.entity';

@Injectable()
export class TenantAdminTypeOrmRepository
  implements ITenantAdminContractRepository
{
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async listTenants(): Promise<TenantOption[]> {
    const tenants = await this.dataSource
      .getRepository(TenantEntity)
      .find({
        order: { createdAt: 'ASC' },
        relations: ['createdByUser'],
        select: {
          id: true,
          createdAt: true,
          createdByUserId: true,
          createdByUser: {
            id: true,
            name: true,
          },
        },
      });

    return tenants.map((tenant) => ({
      id: tenant.id,
      createdAt: tenant.createdAt,
      createdByUserId: tenant.createdByUserId,
      createdByUserName: tenant.createdByUser?.name || null,
    }));
  }

  async userHasTenantAccess(
    userId: string,
    tenantId: string,
  ): Promise<boolean> {
    const total = await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .leftJoin('user.tenants', 'tenant')
      .where('user.id = :userId', { userId })
      .andWhere('tenant.id = :tenantId', { tenantId })
      .getCount();

    return total > 0;
  }

  async listEnterprisesByTenant(
    tenantId: string,
  ): Promise<EnterpriseOption[]> {
    const tenantConnection = await getTenantConnection(tenantId);
    const enterprises = await tenantConnection
      .getRepository(EnterpriseEntity)
      .find({
        order: { name: 'ASC' },
        select: ['id', 'name'],
      });

    return enterprises.map((enterprise) => ({
      id: enterprise.id,
      name: enterprise.name,
    }));
  }
}
