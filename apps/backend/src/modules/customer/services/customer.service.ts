import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REPOSITORY_TOKENS_TENANT } from 'src/infra';
import { ICustomerContractRepository } from 'src/infra/postgres-databases/tenant/repositories/customer/customer.contract.repository';
import {
  IGetAllCustomersResponse,
  IGetCustomerByIdResponse,
  ICreateCustomerResponse,
  IUpdateCustomerResponse,
  IDeleteCustomerResponse,
} from '@global-types/responses/customer.response';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  GetCustomersDto,
} from '../dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(REPOSITORY_TOKENS_TENANT.CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerContractRepository,
  ) {}

  async getAll(
    params: GetCustomersDto,
  ): Promise<IGetAllCustomersResponse> {
    return this.customerRepository.getAll(params);
  }

  async getById(
    id: string,
  ): Promise<IGetCustomerByIdResponse> {
    const customer = await this.customerRepository.getById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async create(
    data: CreateCustomerDto,
  ): Promise<ICreateCustomerResponse> {
    return this.customerRepository.create(data);
  }

  async update(
    id: string,
    data: UpdateCustomerDto,
  ): Promise<IUpdateCustomerResponse> {
    const existing = await this.customerRepository.getById(id);
    if (!existing) {
      throw new NotFoundException('Customer not found');
    }
    return this.customerRepository.update(id, data);
  }

  async remove(id: string): Promise<IDeleteCustomerResponse> {
    const existing = await this.customerRepository.getById(id);
    if (!existing) {
      throw new NotFoundException('Customer not found');
    }
    return this.customerRepository.remove(id);
  }
}
