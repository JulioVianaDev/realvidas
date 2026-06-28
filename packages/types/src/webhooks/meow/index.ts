/**
 * Typed webhook payloads emitted by `apps/whatsmeow` (Go bridge on top of whatsmeow).
 *
 * Usage in consumers:
 *
 * ```ts
 * import { IMeowWebhookEvent } from "@realvidas/types/webhooks/meow";
 *
 * function handle(evt: IMeowWebhookEvent) {
 *   switch (evt.event) {
 *     case "message": evt.data.body; break;
 *     case "message.ack": evt.data.receipt_type; break;
 *     // ...
 *   }
 * }
 * ```
 */

export * from "./common";
export * from "./message";
export * from "./receipt";
export * from "./presence";
export * from "./group";
export * from "./connection";
export * from "./not-mapped";

import { IMeowWebhookEnvelope } from "./common";
import { IMeowMessageAckPayload } from "./receipt";
import {
    IMeowMessageDeletedPayload,
    IMeowMessageEditedPayload,
    IMeowMessagePayload,
    IMeowMessageReactionPayload,
    IMeowMessageRevokedPayload,
} from "./message";
import {
    IMeowChatPresencePayload,
    IMeowPresencePayload,
} from "./presence";
import {
    IMeowGroupInfoPayload,
    IMeowGroupJoinedPayload,
    IMeowGroupParticipantsPayload,
} from "./group";
import {
    IMeowInstanceConnectionPayload,
    IMeowStreamReplacedPayload,
} from "./connection";
import { IMeowNotMappedPayload } from "./not-mapped";

/**
 * Discriminated union of every envelope the bridge can emit.
 * Narrow by `event` to get the correct `data` type.
 */
export type IMeowWebhookEvent =
    | IMeowWebhookEnvelope<IMeowMessagePayload, "message">
    | IMeowWebhookEnvelope<
          IMeowMessageReactionPayload,
          "message.reaction"
      >
    | IMeowWebhookEnvelope<
          IMeowMessageRevokedPayload,
          "message.revoked"
      >
    | IMeowWebhookEnvelope<
          IMeowMessageEditedPayload,
          "message.edited"
      >
    | IMeowWebhookEnvelope<IMeowMessageAckPayload, "message.ack">
    | IMeowWebhookEnvelope<
          IMeowMessageDeletedPayload,
          "message.deleted"
      >
    | IMeowWebhookEnvelope<IMeowPresencePayload, "presence">
    | IMeowWebhookEnvelope<IMeowChatPresencePayload, "chat.presence">
    | IMeowWebhookEnvelope<
          IMeowGroupParticipantsPayload,
          "group.participants"
      >
    | IMeowWebhookEnvelope<IMeowGroupInfoPayload, "group.info">
    | IMeowWebhookEnvelope<IMeowGroupJoinedPayload, "group.joined">
    | IMeowWebhookEnvelope<
          IMeowInstanceConnectionPayload,
          "instance_connected"
      >
    | IMeowWebhookEnvelope<
          IMeowInstanceConnectionPayload,
          "instance_disconnected"
      >
    | IMeowWebhookEnvelope<
          IMeowInstanceConnectionPayload,
          "logged_out"
      >
    | IMeowWebhookEnvelope<
          IMeowStreamReplacedPayload,
          "stream_replaced"
      >
    | IMeowWebhookEnvelope<IMeowNotMappedPayload, "not_mapped">;

/** Convenience helper-type map: event name → payload type. */
export interface IMeowWebhookPayloadMap {
    message: IMeowMessagePayload;
    "message.reaction": IMeowMessageReactionPayload;
    "message.revoked": IMeowMessageRevokedPayload;
    "message.edited": IMeowMessageEditedPayload;
    "message.ack": IMeowMessageAckPayload;
    "message.deleted": IMeowMessageDeletedPayload;
    presence: IMeowPresencePayload;
    "chat.presence": IMeowChatPresencePayload;
    "group.participants": IMeowGroupParticipantsPayload;
    "group.info": IMeowGroupInfoPayload;
    "group.joined": IMeowGroupJoinedPayload;
    instance_connected: IMeowInstanceConnectionPayload;
    instance_disconnected: IMeowInstanceConnectionPayload;
    logged_out: IMeowInstanceConnectionPayload;
    stream_replaced: IMeowStreamReplacedPayload;
    not_mapped: IMeowNotMappedPayload;
}
