import type { ISocialOutboundMessageContent } from '../entities/message.entity-type';

export interface IPostSendConversationMessageBodyRequest {
    enterpriseId: string;
    conversationId: string;
    /** Text body (shorthand for content.type = "text"). */
    body?: string;
    /**
     * Rich content payload — when set, this is dispatched to the social media
     * bridge as-is via {@link ISocialOutboundMessageContent}.
     * If only `body` is provided, it's treated as a text message.
     */
    content?: ISocialOutboundMessageContent;
    /** External message ID to reply to. */
    replyTo?: string;
}
