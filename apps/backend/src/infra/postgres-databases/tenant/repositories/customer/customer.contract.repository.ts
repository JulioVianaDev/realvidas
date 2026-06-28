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

export abstract class ICustomerContractRepository {
  abstract getAll(
    params: IGetAllCustomersParams,
  ): Promise<IGetAllCustomersResponse>;

  abstract getById(
    id: string,
  ): Promise<IGetCustomerByIdResponse>;

  abstract create(
    data: ICreateCustomerBodyRequest,
  ): Promise<ICreateCustomerResponse>;

  abstract update(
    id: string,
    data: IUpdateCustomerBodyRequest,
  ): Promise<IUpdateCustomerResponse>;

  abstract remove(id: string): Promise<IDeleteCustomerResponse>;
}
