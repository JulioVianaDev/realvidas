import {
    ISubscriptionEntity,
    ISubscriptionWithPlan,
} from "../entities/subscription.entity-type";
import { Paginate } from "../helpers/paginate";

export type IGetAllSubscriptionsResponse =
    Paginate<ISubscriptionEntity>;

export type IGetSubscriptionByIdResponse = ISubscriptionEntity;

export type IGetSubscriptionWithPlanResponse = ISubscriptionWithPlan;

export type IGetSubscriptionsByTenantResponse = Paginate<ISubscriptionEntity>;

export type IGetActiveSubscriptionByTenantResponse = ISubscriptionWithPlan | null;

export type IPostSubscriptionResponse = ISubscriptionEntity;

export type IPutSubscriptionResponse = ISubscriptionEntity;

export type ICancelSubscriptionResponse = ISubscriptionEntity;

export type IReactivateSubscriptionResponse = ISubscriptionEntity;

export interface IDeleteSubscriptionResponse {
    success: boolean;
    id: string;
}
