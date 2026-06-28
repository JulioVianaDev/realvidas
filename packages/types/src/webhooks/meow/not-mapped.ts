import { IMeowBasePayload, IMeowTimestamp } from "./common";

/**
 * Payload for `event = "not_mapped"`.
 *
 * Emitted when the Go bridge receives a whatsmeow event that doesn't yet have a
 * dedicated handler. `go_type` is the fully-qualified Go type string (e.g.
 * `*events.PushNameSetting`) — use it to decide which new typed handler to add.
 * `raw_event` is the raw event JSON-marshaled by Go and should be treated as unsafe.
 */
export interface IMeowNotMappedPayload extends IMeowBasePayload {
    go_type: string;
    raw_event: unknown;
    timestamp: IMeowTimestamp;
}
