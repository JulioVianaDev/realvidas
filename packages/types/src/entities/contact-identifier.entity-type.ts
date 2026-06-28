// Conversational contact identifiers (relocated from the old customer types).
// Kept for the conversation feature; unrelated to the B2B customer entity.

export type ContactChannel =
    | "WHATSAPP"
    | "INSTAGRAM"
    | "FACEBOOK"
    | "TELEGRAM"
    | "EMAIL"
    | "PHONE";

export interface IContactIdentifierEntity {
    id: string;
    customerId: string;
    socialMidiaId: number;
    channel: ContactChannel;
    primaryIdentifier: string;
    secondaryIdentifier: string | null;
    phone: string | null;
    country: string | null;
    displayName: string | null;
    metadata: Record<string, unknown> | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
