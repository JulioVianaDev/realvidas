/**
 * Cross-provider contract for social / WhatsApp bridge connectors (inbound webhooks, etc.).
 *
 * Raw HTTP bodies use {@link IMediaConnectionInboundPayload}. Connectors implement
 * `handleTransformInboundWebhookToInternalWebhook` to produce {@link ICommonInboundWebhookEntity}.
 */

/** Known connector ids for the normalized webhook. */
export type IMediaConnectionProviderId = 'meow';

/**
 * Envelope produced by `apps/whatsmeow` (`types.WebhookPayload` → JSON).
 * `data` is the raw Go value: `*events.Message`, a media enhancement map, or a small struct/map.
 */
export interface IMeowWebhookEnvelopeEntity {
    event: string;
    event_type?: string;
    instance: string;
    /** RFC3339 string or other JSON-serialized time from Go */
    timestamp: string | number;
    data: unknown;
}

export type ICommonInboundWebhookKind =
    | 'message'
    | 'instance_lifecycle'
    | 'message_receipt'
    | 'message_edit'
    | 'message_revoke'
    | 'message_delete'
    | 'presence'
    | 'group'
    | 'history'
    | 'other';

/** Normalized inbound message slice (all providers map into this). */
export type ICommonInboundMessageContentType =
    | 'text'
    | 'image'
    | 'video'
    | 'audio'
    | 'document'
    | 'sticker'
    | 'contact'
    | 'location'
    | 'live_location'
    | 'interactive'
    | 'list'
    | 'order'
    | 'unknown';

export interface ICommonInboundMediaRef {
    mimeType?: string;
    /** Path or URL as sent by the provider (e.g. `/media/...`) */
    providerPathOrUrl?: string;
    /** Fully qualified URL when the bridge adds it (`local_file_url` in Meow) */
    localFileUrl?: string;
    filename?: string;
}

export interface ICommonInboundMessageEntity {
    contentType: ICommonInboundMessageContentType;
    /** Plain text body or caption fallback */
    textBody?: string;
    caption?: string;
    externalMessageId?: string;
    senderJid?: string;
    chatJid?: string;
    pushName?: string;
    isFromMe?: boolean;
    isGroup?: boolean;
    media?: ICommonInboundMediaRef;
    /** vCard string or structured contact when available */
    contactVcard?: string;
    /** Degrees when location */
    latitude?: number;
    longitude?: number;
}

export interface ICommonInboundReceiptEntity {
    receiptType?: string;
    messageIds?: string[];
    chatJid?: string;
    senderJid?: string;
}

export interface ICommonInboundInstanceEntity {
    phoneNumber?: string;
    status?: string;
}

/**
 * Canonical inbound webhook your app consumes regardless of provider.
 */
export interface ICommonInboundWebhookEntity {
    provider: IMediaConnectionProviderId;
    instanceKey: string;
    /** Original provider event, e.g. `message_received`, `image_received`, `instance_connected` */
    event: string;
    eventType: string;
    timestampMs: number;
    kind: ICommonInboundWebhookKind;
    message?: ICommonInboundMessageEntity;
    receipt?: ICommonInboundReceiptEntity;
    instance?: ICommonInboundInstanceEntity;
    /** Provider envelope or `data` blob for fields not yet mapped */
    raw: unknown;
}

export interface ITransformInboundWebhookResultEntity {
    success: boolean;
    /** Normalized webhook; `null` if parsing failed or payload is not this provider’s shape */
    common: ICommonInboundWebhookEntity | null;
    errors?: string[];
}

export interface IMediaConnectionInboundPayload {
    raw: unknown;
    /** Optional hint when the HTTP layer already knows the connector */
    provider?: IMediaConnectionProviderId;
}

export interface IMediaConnectionHandleInboundResult {
    /** Whether the connector applied domain logic to this payload (persist, emit event, etc.). */
    handled: boolean;
}
