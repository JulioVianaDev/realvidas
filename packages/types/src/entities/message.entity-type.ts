/**
 * Outbound message shapes for social channel connectors (Meow / WhatsApp bridge, etc.).
 * Kept free of customer-service or chat-session coupling.
 */

/** Public URL + optional filename for media uploaded to your CDN/storage */
export interface ISocialMessageFileRef {
    url: string;
    extension?: string;
    filename?: string;
}

export interface ISocialMessageTextContent {
    type: "text";
    message: string;
}

export interface ISocialMessageImageContent {
    type: "image";
    caption?: string;
    file: ISocialMessageFileRef;
}

export interface ISocialMessageVideoContent {
    type: "video";
    caption?: string;
    file: ISocialMessageFileRef;
}

export interface ISocialMessageDocumentContent {
    type: "document";
    caption?: string;
    file: ISocialMessageFileRef;
}

export interface ISocialMessageAudioContent {
    type: "audio";
    /** When true, prefer voice endpoint (PTT) where the bridge supports it */
    isPTT?: boolean;
    file: ISocialMessageFileRef;
}

export interface ISocialMessageLocationContent {
    type: "location";
    latitude: string | number;
    longitude: string | number;
    address?: string;
}

export type ISocialMessageContactPhoneEntry =
    | { phone: string; is_whatsapp: false }
    | { phone: string; whatsapp: string; is_whatsapp: true };

export interface ISocialMessageContactContent {
    type: "contact";
    name: string;
    phones: ISocialMessageContactPhoneEntry[];
}

export interface ISocialMessageInteractiveButton {
    id: string;
    title: string;
}

export interface ISocialMessageInteractiveContent {
    type: "interactive";
    title: string;
    body: string;
    footer?: string;
    buttons: ISocialMessageInteractiveButton[];
}

export interface ISocialMessageLinkContent {
    type: "link";
    title: string;
    message: string;
    link: string;
    description?: string;
}

export type ISocialOutboundMessageContent =
    | ISocialMessageTextContent
    | ISocialMessageImageContent
    | ISocialMessageVideoContent
    | ISocialMessageDocumentContent
    | ISocialMessageAudioContent
    | ISocialMessageLocationContent
    | ISocialMessageContactContent
    | ISocialMessageInteractiveContent
    | ISocialMessageLinkContent;

export interface ISocialOutboundSendContext {
    /** External / WhatsApp message id to reply to, when the bridge supports it */
    replyTo?: string;
}

/** Single entry point for channel implementations (Meow, future providers). */
export interface ISocialOutboundPayload {
    recipientPhone: string;
    content: ISocialOutboundMessageContent;
    context?: ISocialOutboundSendContext;
}
