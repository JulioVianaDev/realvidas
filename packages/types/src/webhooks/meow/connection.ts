import { IMeowTimestamp } from "./common";

export type IMeowConnectionStatus = "connected" | "disconnected" | "logged_out";

/**
 * Payload shared by `instance_connected`, `instance_disconnected` and `logged_out`.
 * The discriminator is the envelope `event`, not a field inside the payload.
 */
export interface IMeowInstanceConnectionPayload {
    instance_key: string;
    phone_number: string;
    status: IMeowConnectionStatus;
    timestamp: IMeowTimestamp;
}

/** Payload for `event = "stream_replaced"` (WhatsApp session opened elsewhere). */
export interface IMeowStreamReplacedPayload {
    instance_key: string;
}
