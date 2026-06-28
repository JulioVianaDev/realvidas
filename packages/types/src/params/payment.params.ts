import {
    PaymentStatus,
    PaymentMethod,
} from "../entities/payment.entity-type";

export interface IGetAllPaymentsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    tenantId?: string;
    enterpriseId?: string;
    subscriptionId?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface IGetPaymentByIdParams {
    id: string;
}

export interface IGetPaymentStatsParams {
    enterpriseId?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface ICheckPaymentStatusParams {
    id: string;
}

/** Query for GET payments/checkout-session/verify (Stripe Checkout `session_id`). */
export interface IGetVerifyStripeCheckoutSessionParams {
    sessionId: string;
}
