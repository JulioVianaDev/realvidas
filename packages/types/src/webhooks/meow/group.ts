import { IMeowBasePayload, IMeowJID, IMeowTimestamp } from "./common";

export type IMeowGroupParticipantAction = "join" | "leave" | "promote" | "demote";

/** Payload for `event = "group.participants"`. One event is emitted per action. */
export interface IMeowGroupParticipantsPayload extends IMeowBasePayload {
    chat_id: IMeowJID;
    type: IMeowGroupParticipantAction;
    /** Phone JIDs of the affected users (LIDs resolved when possible). */
    jids: IMeowJID[];
    timestamp: IMeowTimestamp;
}

/** Payload for `event = "group.info"` (name / topic / announce / locked changes). */
export interface IMeowGroupInfoPayload extends IMeowBasePayload {
    chat_id: IMeowJID;
    timestamp: IMeowTimestamp;
    name?: string;
    topic?: string;
    announce?: boolean;
    locked?: boolean;
}

/** Payload for `event = "group.joined"` (the connected device was added to a group). */
export interface IMeowGroupJoinedPayload extends IMeowBasePayload {
    chat_id: IMeowJID;
    type: "join";
    jids: IMeowJID[];
    reason?: string;
    group_name?: string;
    timestamp?: IMeowTimestamp;
}
