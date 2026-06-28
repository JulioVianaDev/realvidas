import { PaymentMethod, PaymentStatus } from "../entities/payment.entity-type";

export interface IPostCreatePaymentBodyRequest {
    subscriptionId?: string;
    enterpriseId: string;
    amountInCents: number;
    currency?: string;
    paymentMethod: PaymentMethod;
    installments?: number;
    metadata?: any;
}

export interface IPutUpdatePaymentBodyRequest {
    status?: PaymentStatus;
    providerPaymentId?: string;
    providerCheckoutUrl?: string;
    providerData?: Record<string, any>;
    errorMessage?: string;
    paidAt?: Date;
    refundedAt?: Date;
}
