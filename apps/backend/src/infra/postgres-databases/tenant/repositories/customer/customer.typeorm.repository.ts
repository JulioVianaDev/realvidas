import { Injectable, Inject } from '@nestjs/common';
import { EntityManager, ILike, Repository } from 'typeorm';
import { IGetAllCustomersParams } from '@global-types/params/customer.params';
import {
  IGetAllCustomersResponse,
  IGetCustomerByIdResponse,
  ICreateCustomerResponse,
  IUpdateCustomerResponse,
  IDeleteCustomerResponse,
} from '@global-types/responses/customer.response';
import {
  ICreateCustomerBodyRequest,
  IUpdateCustomerBodyRequest,
} from '@global-types/body-requests/customer.body-request';
import { CustomerEntity } from '../../entities/customer.entity';
import { TENANT_CONNECTION } from '../../tenant.module';
import { ICustomerContractRepository } from './customer.contract.repository';
import { BaseTypeOrmRepository } from '../base.typeorm.repository';

@Injectable()
export class CustomerTypeOrmRepository
  extends BaseTypeOrmRepository
  implements ICustomerContractRepository
{
  private repo: Repository<CustomerEntity>;

  constructor(
    @Inject(TENANT_CONNECTION)
    entityManager: EntityManager | null,
  ) {
    super(entityManager);
    this.repo = this.getManager().getRepository(CustomerEntity);
  }

  async getAll(
    params: IGetAllCustomersParams,
  ): Promise<IGetAllCustomersResponse> {
    const { page = 1, pageSize = 20, search } = params;
    const where = search
      ? [
          { razaoSocial: ILike(`%${search}%`) },
          { nomeFantasia: ILike(`%${search}%`) },
          { cnpjCpf: ILike(`%${search}%`) },
        ]
      : {};
    const [data, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { razaoSocial: 'ASC' },
    });
    return {
      data: data as unknown as IGetAllCustomersResponse['data'],
      metadata: {
        page,
        total,
        hasNextPage: total > page * pageSize,
        hasPreviousPage: page > 1,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  }

  async getById(id: string): Promise<IGetCustomerByIdResponse> {
    return this.repo.findOne({
      where: { id },
    }) as unknown as Promise<IGetCustomerByIdResponse>;
  }

  async create(
    data: ICreateCustomerBodyRequest,
  ): Promise<ICreateCustomerResponse> {
    const created = this.repo.create(
      data as Partial<CustomerEntity>,
    );
    const saved = await this.repo.save(created);
    return saved as unknown as ICreateCustomerResponse;
  }

  async update(
    id: string,
    data: IUpdateCustomerBodyRequest,
  ): Promise<IUpdateCustomerResponse> {
    await this.repo.update(id, data as Partial<CustomerEntity>);
    return this.repo.findOne({
      where: { id },
    }) as unknown as Promise<IUpdateCustomerResponse>;
  }

  async remove(id: string): Promise<IDeleteCustomerResponse> {
    await this.repo.softDelete(id);
    return { success: true, id };
  }
}
