import { Paginate } from "../helpers/paginate";
import { ICustomerEntity } from "../entities/customer.entity-type";

export type IGetAllCustomersResponse = Paginate<ICustomerEntity>;

export type IGetCustomerByIdResponse = ICustomerEntity | null;

export type ICreateCustomerResponse = ICustomerEntity;

export type IUpdateCustomerResponse = ICustomerEntity;

export interface IDeleteCustomerResponse {
    success: boolean;
    id: string;
}
