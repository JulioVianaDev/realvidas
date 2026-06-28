/**
 * JSON bodies for the Go Meow / multi-client WhatsApp bridge (`apps/whatsmeow`).
 * Field names match `internal/types/types.go` json tags.
 */

export interface IMeowConnectInstanceBodyRequest {
    instance_key: string;
}

export interface IMeowCreateInstanceBodyRequest {
    instance_key: string;
}
export interface IMeowSendTextMessageBodyRequest {
    instance_key: string;
    phone: string;
    message: string;
    reply_to?: string;
}

export type IMeowSendMediaType = "image" | "audio" | "video" | "file";

export interface IMeowSendMediaMessageBodyRequest {
    instance_key: string;
    phone: string;
    url: string;
    type: IMeowSendMediaType;
    caption?: string;
    /** For audio: true = voice note (PTT) */
    is_ptt?: boolean;
}

export interface IMeowSendVoiceMessageBodyRequest {
    instance_key: string;
    phone: string;
    url: string;
    reply_to?: string;
}

export interface IMeowSendLocationMessageBodyRequest {
    instance_key: string;
    phone: string;
    latitude: number;
    longitude: number;
    reply_to?: string;
}

export interface IMeowSendContactMessageBodyRequest {
    instance_key: string;
    phone: string;
    contact_name: string;
    contact_phone: string;
    reply_to?: string;
}

export interface IMeowInteractiveButtonBodyRequest {
    id: string;
    title: string;
}

export interface IMeowSendInteractiveMessageBodyRequest {
    instance_key: string;
    phone: string;
    title: string;
    body: string;
    footer?: string;
    buttons: IMeowInteractiveButtonBodyRequest[];
    reply_to?: string;
}

export interface IMeowValidatePhoneBodyRequest {
    instance_key: string;
    phone: string;
}

export interface IMeowLidToPhoneBodyRequest {
    instance_key: string;
    lid: string;
}
