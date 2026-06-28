import {
    IAdminAnalyticsMessageToolUsage,
    IAdminAnalyticsMessageUsage,
    IAdminAnalyticsRalphStepDocument,
} from "../entities/admin-analytics.entity-type";

/**
 * Producer-facing cost shape — plain USD floats. The ingest layer converts
 * to integer nanodollars once, so producers never need to care about
 * precision (they just send the number their billing pipeline computed).
 */
export interface IAdminAnalyticsMessageCostUsd {
    inputCostUsd: number;
    cachedInputCostUsd: number;
    outputCostUsd: number;
    totalCostUsd: number;
    sellUsd: number;
}

/**
 * Queue / ingest payloads. These are the shapes producers (other services,
 * RabbitMQ consumers, the example ingest service) must emit so the analytics
 * layer can upsert into Elasticsearch without guessing field names.
 *
 * Every payload carries `tenantId` + `enterpriseId` explicitly — this module
 * is global and cross-tenant (admin-only), so we never derive tenant from CLS.
 */

export type AdminAnalyticsIngestKindType =
    | "UPSERT_AI"
    | "UPSERT_TOOL"
    | "UPSERT_RALPH"
    | "RECORD_MESSAGE"
    | "CLOSE_CONVERSATION"
    | "RECORD_RALPH_USAGE";

export interface IAdminAnalyticsUpsertAiBodyRequest {
    kind: "UPSERT_AI";
    id: string;
    tenantId: string;
    enterpriseId: string;
    name: string;
    aiModel: string;
    toolsIds: string[];
    ralphsIds: string[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface IAdminAnalyticsUpsertToolBodyRequest {
    kind: "UPSERT_TOOL";
    id: string;
    tenantId: string;
    enterpriseId: string;
    name: string;
    description: string;
    objectiveName: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface IAdminAnalyticsUpsertRalphBodyRequest {
    kind: "UPSERT_RALPH";
    id: string;
    tenantId: string;
    enterpriseId: string;
    name: string;
    espicification: string;
    steps: IAdminAnalyticsRalphStepDocument[];
    createdAt: string;
    updatedAt: string;
    softDeletedAt: string | null;
}

export interface IAdminAnalyticsRecordMessageBodyRequest {
    kind: "RECORD_MESSAGE";
    messageId: string;
    tenantId: string;
    enterpriseId: string;
    aiId: string;
    aiModel: string;
    conversationId: string;
    socialMediaId: string;
    timestamp: string;
    usage: IAdminAnalyticsMessageUsage;
    cost: IAdminAnalyticsMessageCostUsd;
    toolsUsage: IAdminAnalyticsMessageToolUsage[];
}

export interface IAdminAnalyticsCloseConversationBodyRequest {
    kind: "CLOSE_CONVERSATION";
    conversationId: string;
    tenantId: string;
    enterpriseId: string;
    aiId: string;
    aiModel: string;
    socialMediaId: string;
    startAt: string;
    finishedAt: string;
    neededHuman: boolean;
}

export interface IAdminAnalyticsRecordRalphUsageBodyRequest {
    kind: "RECORD_RALPH_USAGE";
    id: string;
    tenantId: string;
    enterpriseId: string;
    aiId: string;
    ralphId: string;
    conversationId: string;
    stoppedAtStepPosition: number | null;
    completed: boolean;
    createdAt: string;
}

export type IAdminAnalyticsIngestBodyRequest =
    | IAdminAnalyticsUpsertAiBodyRequest
    | IAdminAnalyticsUpsertToolBodyRequest
    | IAdminAnalyticsUpsertRalphBodyRequest
    | IAdminAnalyticsRecordMessageBodyRequest
    | IAdminAnalyticsCloseConversationBodyRequest
    | IAdminAnalyticsRecordRalphUsageBodyRequest;
