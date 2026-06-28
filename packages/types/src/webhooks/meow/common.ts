/**
 * Shared primitives for webhook payloads emitted by `apps/whatsmeow`.
 *
 * All events are published to RabbitMQ wrapped in `IMeowWebhookEnvelope<T>` where
 * `T` is the concrete payload type (see the other files in this folder).
 */

/** Event names emitted by the Go bridge. Use these as the discriminator. */
export type IMeowWebhookEventName =
    | "message"
    | "message.reaction"
    | "message.revoked"
    | "message.edited"
    | "message.ack"
    | "message.deleted"
    | "presence"
    | "chat.presence"
    | "group.participants"
    | "group.info"
    | "group.joined"
    | "instance_connected"
    | "instance_disconnected"
    | "logged_out"
    | "stream_replaced"
    | "not_mapped";

/** Top-level envelope published to RabbitMQ for every webhook event. */
export interface IMeowWebhookEnvelope<
    TPayload = unknown,
    TEvent extends IMeowWebhookEventName = IMeowWebhookEventName,
> {
    event: TEvent;
    /** Duplicate of `event` kept for backwards-compat with older consumers. */
    event_type: TEvent;
    instance: string;
    timestamp: string;
    data: TPayload;
}

/** ISO-8601 UTC timestamp string (e.g. `2026-04-15T12:34:56Z`). */
export type IMeowTimestamp = string;

/** WhatsApp JID in the `phone@s.whatsapp.net` / `id@g.us` / `id@lid` format. */
export type IMeowJID = string;

/** Fields present on almost every payload. */
export interface IMeowBasePayload {
    /** The device JID (primary phone-JID) of the connected account. */
    device_id?: IMeowJID;
    timestamp?: IMeowTimestamp;
}
