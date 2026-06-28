import type { ContactChannel, IContactIdentifierEntity } from './contact-identifier.entity-type';

export enum ConversationLifecycleModeType {
    AI = "AI",
    HUMAN = "HUMAN",
}

export enum ConversationStatusType {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
}

export interface IConversationCustomerSummary {
    id: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    country: string | null;
    contactIdentifiers?: IContactIdentifierEntity[];
}

export interface IConversationLastMessage {
    id: string;
    body: string | null;
    role: string;
    createdAt: string;
    content?: Record<string, unknown> | null;
}

export interface IConversationEntity {
    id: string;
    enterpriseId: string;
    customerId: string;
    socialMidiaId: number;
    chatIdentifier: string;
    mode: ConversationLifecycleModeType;
    status: ConversationStatusType;
    assistantId: string | null;
    userId: string | null;
    metadata: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    customer?: IConversationCustomerSummary | null;
    lastMessage?: IConversationLastMessage | null;
    unreadCount?: number;
    /** Channel of the active contact identifier for this conversation. */
    channel?: ContactChannel;
}
