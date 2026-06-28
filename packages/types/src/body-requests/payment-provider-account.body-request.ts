import { PaymentProviderAccountProvider } from "../entities/payment-provider-account.entity-type";

export interface IPostCreatePaymentProviderAccountBodyRequest {
    enterpriseId: string;
    provider: PaymentProviderAccountProvider;
    name: string;
    cpfCnpj: string;
    email?: string;
    birthDate?: string;
    companyType?: string;
    phone?: string;
    mobilePhone?: string;
    address?: string;
    addressNumber?: string;
    complement?: string;
    province?: string;
    postalCode?: string;
    incomeValue?: number;
    pixKey?: string;
}

export interface IPutUpdatePaymentProviderAccountBodyRequest {
    isActive?: boolean;
}
