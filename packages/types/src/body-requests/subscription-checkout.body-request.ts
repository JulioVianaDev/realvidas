import { BillingCycle } from "../entities/subscription.entity-type";
import { PaymentMethod } from "../entities/payment.entity-type";

export type BillingTaxIdType = "CPF" | "CNPJ";

export interface IPostSubscriptionCheckoutBodyRequest {
    planId: string;
    billingCycle: BillingCycle;
    paymentMethod: PaymentMethod;
    enterpriseId: string;
    billingTaxIdType: BillingTaxIdType;
}
