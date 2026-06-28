export type PaymentProviderAccountProvider = "ASAAS" | "OPENPIX";

export type PaymentProviderAccountStatus =
    | "PENDING"
    | "ACTIVE"
    | "SUSPENDED"
    | "REJECTED";

export interface IPaymentProviderAccountEntity {
    id: string;
    enterpriseId: string;
    provider: PaymentProviderAccountProvider;
    providerAccountId: string;
    providerWalletId: string | null;
    providerPixKey: string | null;
    providerApiKey: string | null;
    providerData: Record<string, any> | null;
    status: PaymentProviderAccountStatus;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
