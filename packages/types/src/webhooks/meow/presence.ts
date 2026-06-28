import { IMeowBasePayload, IMeowJID, IMeowTimestamp } from "./common";

/** Payload for `event = "presence"` (user online/offline). */
export interface IMeowPresencePayload extends IMeowBasePayload {
    from: IMeowJID;
    from_lid?: IMeowJID;
    unavailable: boolean;
    /** Present when WhatsApp disclosed the user's last-seen timestamp. */
    last_seen?: IMeowTimestamp;
    timestamp: IMeowTimestamp;
}

export type IMeowChatPresenceState = "composing" | "paused" | "recording" | string;
export type IMeowChatPresenceMedia = "" | "audio" | string;

/** Payload for `event = "chat.presence"` (typing / recording indicators). */
export interface IMeowChatPresencePayload extends IMeowBasePayload {
    chat_id: IMeowJID;
    from: IMeowJID;
    from_lid?: IMeowJID;
    state: IMeowChatPresenceState;
    media: IMeowChatPresenceMedia;
    timestamp: IMeowTimestamp;
}
