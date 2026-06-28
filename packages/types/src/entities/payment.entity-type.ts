import { ISubscriptionEntity } from "./subscription.entity-type";

export type PaymentStatus =
    | "PENDING"
    | "PROCESSING"
    | "PAID"
    | "FAILED"
    | "REFUNDED"
    | "CANCELED"
    | "EXPIRED";

export type PaymentMethod =
    | "PIX"
    | "CREDIT_CARD"
    | "BANK_SLIP"
    | "DEBIT_CARD";

export type PaymentProvider = "STRIPE" | "OPENPIX" | "ASAAS" | "NONE";

export interface IPaymentEntity {
    id: string;
    subscriptionId: string | null;
    tenantId: string;
    amountInCents: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    providerName: PaymentProvider;
    providerPaymentId: string | null;
    providerCheckoutUrl: string | null;
    providerData: Record<string, any> | null;
    installments: number | null;
    metadata: any;
    errorMessage: string | null;
    paidAt: Date | null;
    expiresAt: Date | null;
    refundedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface IPaymentWithSubscription extends IPaymentEntity {
    subscription: ISubscriptionEntity | null;
}
