import { IPaymentEntity } from "../entities/payment.entity-type";
import { ISubscriptionEntity } from "../entities/subscription.entity-type";

export interface IAdminSaasTenantOverview {
    id: string;
    createdAt: Date;
    createdByUserId: string;
    createdByUserName: string | null;
    hasActiveBilling: boolean;
    activeSubscriptionId: string | null;
    activeSubscriptionStatus: string | null;
    pendingPaymentsCount: number;
    lastPaymentStatus: string | null;
    lastPaymentAt: Date | null;
}

export interface IGetAdminSaasTenantsResponse {
    data: IAdminSaasTenantOverview[];
}

export interface IGetAdminSaasTenantBillingResponse {
    tenantId: string;
    subscriptions: ISubscriptionEntity[];
    payments: IPaymentEntity[];
    hasActiveBilling: boolean;
}

export interface IPostAdminSaasSimulatePaymentPaidResponse {
    payment: IPaymentEntity;
    subscription: ISubscriptionEntity | null;
}

export interface IPostAdminSaasGrantTenantAccessResponse {
    subscription: ISubscriptionEntity;
    payment: IPaymentEntity;
}
