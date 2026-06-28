import { BillingCycle } from "../entities/subscription.entity-type";

export interface IPostCreateSubscriptionBodyRequest {
    planId: string;
    billingCycle: BillingCycle;
}

export interface IPutUpdateSubscriptionBodyRequest {
    status?:
        | "PENDING"
        | "ACTIVE"
        | "PAST_DUE"
        | "CANCELED"
        | "EXPIRED"
        | "PAUSED";
    nextBillingDate?: Date;
    endDate?: Date;
}

export interface IPostCancelSubscriptionBodyRequest {
    reason?: string;
}

export interface IPostReactivateSubscriptionBodyRequest {
    planId?: string;
    billingCycle?: BillingCycle;
}
