export enum ConversationMessageRoleType {
    USER = "USER",
    ASSISTANT = "ASSISTANT",
    AGENT = "AGENT",
    SYSTEM = "SYSTEM",
}

export interface IConversationMessageEntity {
    id: string;
    conversationId: string;
    customerId: string;
    role: ConversationMessageRoleType;
    body: string | null;
    externalMessageId: string | null;
    content: Record<string, unknown> | null;
    createdAt: string;
}
