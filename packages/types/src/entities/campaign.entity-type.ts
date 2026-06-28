export type ICampaignStatus =
    | "IMPORTING"
    | "READY"
    | "RUNNING"
    | "COMPLETED"
    | "FAILED";

export type ICampaignRecipientStatus =
    | "PENDING"
    | "QUEUED"
    | "SENT"
    | "DELIVERED"
    | "READ"
    | "RESPONDED"
    | "FAILED";

export interface ICampaignEntity {
    id: string;
    enterpriseId: string;
    socialMidiaId: number;
    assistantId: string | null;
    name: string;
    description: string | null;
    messageBody: string;
    followUpPrompt: string | null;
    status: ICampaignStatus;
    csvFileUrl: string | null;
    totalRecipients: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface ICampaignRecipientEntity {
    id: string;
    campaignId: string;
    customerId: string;
    contactIdentifierId: string | null;
    recipientName: string | null;
    recipientPhone: string;
    sortOrder: number;
    status: ICampaignRecipientStatus;
    jobId: string | null;
    conversationId: string | null;
    conversationMessageId: string | null;
    externalMessageId: string | null;
    sentAt: Date | null;
    deliveredAt: Date | null;
    readAt: Date | null;
    respondedAt: Date | null;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
}
