import { IPaymentProviderAccountEntity } from "../entities/payment-provider-account.entity-type";
import { Paginate } from "../helpers/paginate";

export type IGetAllPaymentProviderAccountsResponse =
    Paginate<IPaymentProviderAccountEntity>;

export type IGetPaymentProviderAccountByIdResponse =
    IPaymentProviderAccountEntity;

export type IPostCreatePaymentProviderAccountResponse =
    IPaymentProviderAccountEntity;

export type IPutUpdatePaymentProviderAccountResponse =
    IPaymentProviderAccountEntity;

export interface IDeletePaymentProviderAccountResponse {
    success: boolean;
    id: string;
}
