import { IPaymentEntity } from "../entities/payment.entity-type";
import { ISubscriptionEntity } from "../entities/subscription.entity-type";

export interface IPostSubscriptionCheckoutResponse {
    subscription: ISubscriptionEntity;
    payment: IPaymentEntity;
}
