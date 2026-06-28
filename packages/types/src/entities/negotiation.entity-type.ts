export type NegotiationStatus =
    | 'OPEN'
    | 'SENT'
    | 'PAID'
    | 'EXPIRED'
    | 'CANCELLED';

export const NEGOTIATION_STATUS_VALUES: NegotiationStatus[] = [
    'OPEN',
    'SENT',
    'PAID',
    'EXPIRED',
    'CANCELLED',
];

export interface INegotiationItemEntity {
    id: string;
    negotiationId: string;
    productId: string;
    /** Snapshot of the product name at the time it was added. */
    productName: string;
    /** Unit price in cents — snapshot from product at time of add. */
    unitPriceInCents: number;
    quantity: number;
    /** unitPriceInCents * quantity — always computed as integer multiplication. */
    totalInCents: number;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface INegotiationEntity {
    id: string;
    enterpriseId: string;
    customerId: string | null;
    conversationId: string | null;
    status: NegotiationStatus;
    /** Sum of all item totalInCents — in cents. */
    subtotalInCents: number;
    /** Discount applied — in cents. */
    discountInCents: number;
    /** subtotalInCents - discountInCents — in cents. */
    totalInCents: number;
    /** Reference to payment ID in main database (after finalization). */
    paymentId: string | null;
    /** Checkout URL sent to the customer. */
    paymentUrl: string | null;
    notes: string | null;
    expiresAt: Date | null;
    paidAt: Date | null;
    items: INegotiationItemEntity[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
