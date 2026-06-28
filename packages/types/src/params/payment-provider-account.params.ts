import {
    PaymentProviderAccountProvider,
    PaymentProviderAccountStatus,
} from "../entities/payment-provider-account.entity-type";

export interface IGetAllPaymentProviderAccountsParams {
    page?: number;
    pageSize?: number;
    enterpriseId?: string;
    provider?: PaymentProviderAccountProvider;
    status?: PaymentProviderAccountStatus;
}
