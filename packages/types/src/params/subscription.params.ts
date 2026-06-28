import { SubscriptionStatus } from "../entities/subscription.entity-type";

export interface IGetAllSubscriptionsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: SubscriptionStatus;
}

export interface IGetSubscriptionByIdParams {
    id: string;
}

/** Query params for `GET /subscriptions/me` (workspace resolved on the server via CLS). */
export interface IGetSubscriptionsForCurrentTenantParams {
    page?: number;
    pageSize?: number;
    status?: SubscriptionStatus;
}
