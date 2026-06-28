import { IMeowBasePayload, IMeowJID, IMeowTimestamp } from "./common";

/**
 * Media descriptor attached to any message that carries binary content.
 * `local_file_url` / `url` are populated only when auto-download succeeded.
 */
export interface IMeowMessageMediaEntity {
    type: "image" | "video" | "audio" | "document" | "sticker" | "video_note";
    /** Original caption from WhatsApp. */
    caption?: string;
    /** Relative path served by the whatsmeow bridge (`/media/...`). */
    url?: string;
    /** Absolute HTTP URL for downstream consumers (base + url). */
    local_file_url?: string;
    /** Absolute filesystem path on the bridge container. */
    media_path?: string;
    mime_type?: string;
    /** Raw WhatsApp CDN URL (encrypted — usually useless to the consumer). */
    remote_url?: string;
    /** Only present on documents. */
    filename?: string;
}

export interface IMeowContactInfoEntity {
    display_name: string;
    vcard: string;
}

export interface IMeowLocationInfoEntity {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
}

export interface IMeowLiveLocationInfoEntity {
    latitude: number;
    longitude: number;
    caption?: string;
}

export interface IMeowListInfoEntity {
    title: string;
    description: string;
    button_text: string;
}

export interface IMeowOrderInfoEntity {
    title: string;
    message: string;
    seller_jid: string;
    total_amount: number;
    total_currency: string;
}

export interface IMeowPollInfoEntity {
    name: string;
    options: string[];
}

/** Payload for `event = "message"` (regular incoming or outgoing message). */
export interface IMeowMessagePayload extends IMeowBasePayload {
    id: string;
    timestamp: IMeowTimestamp;
    is_from_me: boolean;
    is_group: boolean;

    /** Resolved phone JID of the sender. */
    from: IMeowJID;
    /** Original `@lid` JID when WhatsApp used the LID addressing mode. */
    from_lid?: IMeowJID;
    from_name?: string;

    /** Resolved chat JID (group id or phone). */
    chat_id: IMeowJID;
    chat_lid?: IMeowJID;

    /** Text body or caption. */
    body?: string;

    /** Reply context. */
    replied_to_id?: string;
    quoted_body?: string;

    /** Flags. */
    view_once?: boolean;
    forwarded?: boolean;

    /** Media. Exactly one is set for media messages. */
    image?: IMeowMessageMediaEntity;
    video?: IMeowMessageMediaEntity;
    audio?: IMeowMessageMediaEntity;
    document?: IMeowMessageMediaEntity;
    sticker?: IMeowMessageMediaEntity;
    video_note?: IMeowMessageMediaEntity;

    /** Structured content. */
    contact?: IMeowContactInfoEntity;
    contacts_array?: IMeowContactInfoEntity[];
    location?: IMeowLocationInfoEntity;
    live_location?: IMeowLiveLocationInfoEntity;
    list?: IMeowListInfoEntity;
    order?: IMeowOrderInfoEntity;
    poll?: IMeowPollInfoEntity;
}

/** Payload for `event = "message.reaction"`. */
export interface IMeowMessageReactionPayload extends IMeowBasePayload {
    id: string;
    timestamp: IMeowTimestamp;
    is_from_me: boolean;
    is_group: boolean;
    from: IMeowJID;
    from_lid?: IMeowJID;
    from_name?: string;
    chat_id: IMeowJID;
    chat_lid?: IMeowJID;
    /** Emoji sent as reaction. Empty string means "remove reaction". */
    reaction: string;
    reacted_message_id?: string;
}

/** Payload for `event = "message.revoked"`. */
export interface IMeowMessageRevokedPayload extends IMeowBasePayload {
    id: string;
    timestamp: IMeowTimestamp;
    is_from_me: boolean;
    is_group: boolean;
    from: IMeowJID;
    from_lid?: IMeowJID;
    from_name?: string;
    chat_id: IMeowJID;
    chat_lid?: IMeowJID;
    revoked_message_id: string;
    revoked_from_me: boolean;
    revoked_chat?: IMeowJID;
}

/** Payload for `event = "message.edited"`. */
export interface IMeowMessageEditedPayload extends IMeowBasePayload {
    id: string;
    timestamp: IMeowTimestamp;
    is_from_me: boolean;
    is_group: boolean;
    from: IMeowJID;
    from_lid?: IMeowJID;
    from_name?: string;
    chat_id: IMeowJID;
    chat_lid?: IMeowJID;
    original_message_id?: string;
    body?: string;
}

/** Payload for `event = "message.deleted"` (DeleteForMe). */
export interface IMeowMessageDeletedPayload extends IMeowBasePayload {
    deleted_message_id: string;
    timestamp: IMeowTimestamp;
    from: IMeowJID;

    /** Populated when the original message was seen by this bridge. */
    chat_id?: IMeowJID;
    original_content?: string;
    original_sender?: IMeowJID;
    original_timestamp?: IMeowTimestamp;
    was_from_me?: boolean;
    original_media_type?: "image" | "video" | "audio" | "sticker" | "document";
    original_filename?: string;
}
