import {
    IPaymentEntity,
    IPaymentWithSubscription,
} from "../entities/payment.entity-type";
import { Paginate } from "../helpers/paginate";

export type IGetAllPaymentsResponse = Paginate<IPaymentEntity>;

export type IGetPaymentByIdResponse = IPaymentWithSubscription;

export interface IGetPaymentStatsResponse {
    totalRevenue: number; // Em centavos
    totalPaid: number; // Em centavos
    totalPending: number; // Em centavos
    totalFailed: number; // Em centavos
    totalRefunded: number; // Em centavos
    totalPayments: number;
    paidCount: number;
    pendingCount: number;
    failedCount: number;
    refundedCount: number;
    currency: string;
}

export type IPostPaymentResponse = IPaymentEntity;

export type IPutPaymentResponse = IPaymentEntity;

export type ICheckPaymentStatusResponse = IPaymentEntity;

export interface IDeletePaymentResponse {
    success: boolean;
    id: string;
}

/** Server-verified Stripe Checkout outcome for the success page. */
export interface IVerifyStripeCheckoutSessionResponse {
    /**
     * True when Stripe reports `status=complete` and paid-class `payment_status`
     * (`paid` or `no_payment_required`). Local DB may still be catching up.
     */
    paid: boolean;
    /** Stripe `checkout.session` status (e.g. complete, open, expired). */
    stripeSessionStatus: string;
    /** Stripe `payment_status` (e.g. paid, unpaid, no_payment_required). */
    stripePaymentStatus: string;
    /** `payment` or `subscription` Checkout mode. */
    stripeMode: string | null;
    /** Our payment row after optional sync from Stripe. */
    localPaymentStatus: string;
    /** Present when this checkout was tied to a subscription. */
    subscriptionStatus?: string | null;
    /** From checkout metadata when available. */
    planDisplayName?: string | null;
    amountInCents: number;
    currency: string;
}
