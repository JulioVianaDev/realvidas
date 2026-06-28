import { Paginate } from "../helpers/paginate";
import { IConversationEntity } from "../entities/conversation.entity-type";
import { IConversationMessageEntity } from "../entities/conversation-message.entity-type";

export type IGetAllConversationsResponse = Paginate<IConversationEntity>;
export type IGetConversationByIdResponse = IConversationEntity | null;
export type IGetConversationMessagesByCustomerResponse =
    Paginate<IConversationMessageEntity>;
export type IPostSendConversationMessageResponse = IConversationMessageEntity;
export type ICloseConversationResponse = IConversationEntity;
export type IGetAiConversationsResponse = Paginate<IConversationEntity>;
export type IGetMyConversationsResponse = Paginate<IConversationEntity>;
export type IGetConversationMessagesResponse =
    Paginate<IConversationMessageEntity>;
