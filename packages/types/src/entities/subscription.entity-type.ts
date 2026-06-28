import { IPlanEntity } from "./plan.entity-type";

export type SubscriptionStatus =
    | "PENDING"
    | "ACTIVE"
    | "PAST_DUE"
    | "CANCELED"
    | "EXPIRED"
    | "PAUSED";

export type BillingCycle = "MONTHLY" | "YEARLY";

export interface ISubscriptionEntity {
    id: string;
    planId: string;
    status: SubscriptionStatus;
    billingCycle: BillingCycle;
    billingDay: number;
    priceInCents: number;
    currency: string;
    startDate: Date;
    endDate: Date | null;
    nextBillingDate: Date | null;
    canceledAt: Date | null;
    /** Stripe `sub_...` when checkout uses `mode: subscription`. */
    stripeSubscriptionId?: string | null;
    /** Stripe `cus_...`. */
    stripeCustomerId?: string | null;
    /** Provider-agnostic subscription ID (Asaas sub id, Woovie subscription id, etc.). */
    providerSubscriptionId?: string | null;
    /** Provider-agnostic customer ID (Asaas customer id, Woovie customer id, etc.). */
    providerCustomerId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface ISubscriptionWithPlan extends ISubscriptionEntity {
    plan: IPlanEntity;
}

/** Row shape for DB insert only — `tenantId` is never exposed on HTTP APIs. */
export type ISubscriptionCreateInput = Omit<
    ISubscriptionEntity,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
> & {
    tenantId: string;
};

