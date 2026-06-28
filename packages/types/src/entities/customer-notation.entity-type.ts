export type ICustomerNotationStatus = "POSITIVE" | "NEGATIVE" | "NEUTRAL";

export interface ICustomerNotationEntity {
    id: string;
    enterpriseId: string;
    customerId: string;
    /** Optional pipeline card this notation relates to. */
    cardId: string | null;
    /** Assistant that created the notation (when written by AI). */
    assistantId: string | null;
    details: string;
    status: ICustomerNotationStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export const CUSTOMER_NOTATION_STATUSES: ICustomerNotationStatus[] = [
    "POSITIVE",
    "NEGATIVE",
    "NEUTRAL",
];
