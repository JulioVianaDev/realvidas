import { ConversationStatusType } from "../entities/conversation.entity-type";

export interface IGetAllConversationsParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    status?: ConversationStatusType;
}

export interface IGetConversationByIdParams {
    id: string;
}

export interface IConversationEnterpriseQueryParams {
    enterpriseId: string;
}

export interface IGetConversationMessagesByCustomerParams {
    enterpriseId: string;
    customerId: string;
    page?: number;
    pageSize?: number;
}

export interface ICloseConversationParams {
    id: string;
    enterpriseId: string;
}

export interface IGetAiConversationsParams {
    enterpriseId: string;
    assistantId: string;
    page?: number;
    pageSize?: number;
    search?: string;
}

export interface IGetMyConversationsParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
}

export interface IGetConversationMessagesParams {
    conversationId: string;
    enterpriseId: string;
    page?: number;
    pageSize?: number;
}
