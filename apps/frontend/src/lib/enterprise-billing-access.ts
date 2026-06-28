import { ISubscriptionEntity } from "@global-types/entities/subscription.entity-type";

/**
 * Main-DB subscriptions that unblock verified routes (aligned with backend
 * {@link tenantHasSubscriptionBillingAccess}).
 *
 * Only **ACTIVE** counts as paid access. `PENDING` is checkout / payment not
 * completed; `PAST_DUE` is not treated as full access here (renew separately).
 */
export function subscriptionsGrantAppAccess(
    subscriptions: ISubscriptionEntity[] | undefined | null,
): boolean {
    if (!subscriptions?.length) {
        return false;
    }
    return subscriptions.some((s) => s.status === "ACTIVE");
}
