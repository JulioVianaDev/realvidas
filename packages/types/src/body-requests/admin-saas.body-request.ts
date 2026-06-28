import { BillingCycle } from "../entities/subscription.entity-type";

export interface IPostAdminSaasGrantTenantAccessBodyRequest {
    planId?: string;
    billingCycle?: BillingCycle;
}
