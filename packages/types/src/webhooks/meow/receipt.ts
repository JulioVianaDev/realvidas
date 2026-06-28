import { IMeowBasePayload, IMeowJID, IMeowTimestamp } from "./common";

/** WhatsApp receipt types, matching the `receipt_type` field on the payload. */
export type IMeowReceiptType =
    | "delivered"
    | "sender"
    | "retry"
    | "read"
    | "read_self"
    | "played"
    | "played_self";

/** Payload for `event = "message.ack"`. */
export interface IMeowMessageAckPayload extends IMeowBasePayload {
    chat_id: IMeowJID;
    from: IMeowJID;
    from_lid?: IMeowJID;
    receipt_type: IMeowReceiptType;
    timestamp: IMeowTimestamp;
    /** IDs of the messages this receipt applies to. */
    message_ids?: string[];
}
