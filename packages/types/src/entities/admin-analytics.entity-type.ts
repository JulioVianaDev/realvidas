/**
 * Admin Analytics — Elasticsearch document shapes.
 *
 * Every document carries `tenantId` + `enterpriseId` as keyword fields so the
 * SaaS owner (global admin) can freely cross-filter. Every read MUST be
 * composed with `IAdminAnalyticsFilters`; there is no per-tenant index.
 *
 * Money is stored as `long` in **nanodollars** (integer, 1 USD = 1_000_000_000
 * nanos). This guarantees that increments, sums, and per-message accumulation
 * are integer-exact — no "0.1 + 0.7 = 0.7999…" drift anywhere in the pipeline.
 * Producers send USD floats (see body-request types); the ingest layer converts
 * to nanos once with `Math.round(usd * 1e9)` and everything downstream operates
 * on integers. Responses convert nanos back to USD only at the final boundary.
 *
 * JS `number` represents integers exactly up to 2^53 ≈ 9_007_199_254_740_992,
 * i.e. ~$9 million per single aggregated total. Single-message costs and
 * per-conversation sums are well within this range.
 */

export const ADMIN_ANALYTICS_USD_NANO_SCALE = 1_000_000_000;

export type AdminAnalyticsTimeRangeType =
    | "ALL"
    | "YEAR"
    | "MONTH"
    | "WEEK";

/** ─────────────────────── filter payload (shared) ─────────────────────── */

export interface IAdminAnalyticsFilters {
    tenantId?: string;
    enterpriseIds?: string[];
    aiModels?: string[];
    aiIds?: string[];
    socialMediaIds?: string[];
    range?: AdminAnalyticsTimeRangeType;
}

/** ─────────────────────── ES document shapes ──────────────────────────── */

export interface IAdminAnalyticsAiDocument {
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

export interface IAdminAnalyticsToolDocument {
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

export interface IAdminAnalyticsRalphStepDocument {
    uuid: string;
    position: number;
    description: string;
}

export interface IAdminAnalyticsRalphDocument {
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

export interface IAdminAnalyticsMessageUsage {
    promptTokens: number;
    completionTokens: number;
    cachedTokens: number;
    totalTokens: number;
}

/** ES document cost shape — integer nanodollars. */
export interface IAdminAnalyticsMessageCostNanos {
    inputCostUsdNanos: number;
    cachedInputCostUsdNanos: number;
    outputCostUsdNanos: number;
    totalCostUsdNanos: number;
    sellUsdNanos: number;
}

export interface IAdminAnalyticsMessageToolUsage {
    toolId: string;
    toolUsageId: string;
    createdAt: string;
}

export interface IAdminAnalyticsMessageDocument {
    id: string;
    tenantId: string;
    enterpriseId: string;
    aiId: string;
    aiModel: string;
    conversationId: string;
    socialMediaId: string;
    timestamp: string;
    usage: IAdminAnalyticsMessageUsage;
    cost: IAdminAnalyticsMessageCostNanos;
    toolsUsage: IAdminAnalyticsMessageToolUsage[];
}

export interface IAdminAnalyticsConversationDocument {
    id: string;
    tenantId: string;
    enterpriseId: string;
    aiId: string;
    aiModel: string;
    socialMediaId: string;
    startAt: string;
    finishedAt: string | null;
    messagesQuantity: number;
    totalToolsUsage: number;
    totalSessionPromptTokens: number;
    totalSessionCompletionTokens: number;
    totalSessionCachedTokens: number;
    totalSessionTokens: number;
    totalSessionCostUsdNanos: number;
    totalSessionSellUsdNanos: number;
    totalSessionWonUsdNanos: number;
    neededHuman: boolean;
}

export interface IAdminAnalyticsRalphUsageDocument {
    id: string;
    tenantId: string;
    enterpriseId: string;
    aiId: string;
    conversationId: string;
    ralphId: string;
    stoppedAtStepPosition: number | null;
    completed: boolean;
    createdAt: string;
}

/** ─────────────────────── chart result shapes ─────────────────────────── */

export interface IAdminAnalyticsAiBucket {
    aiId: string;
    aiName: string;
    aiModel: string;
    value: number;
}

export interface IAdminAnalyticsTimeSeriesPoint {
    timestamp: string;
    promptTokens: number;
    completionTokens: number;
    cachedTokens: number;
    totalTokens: number;
}

export interface IAdminAnalyticsAiTimeSeriesSeries {
    aiId: string;
    aiName: string;
    aiModel: string;
    points: IAdminAnalyticsTimeSeriesPoint[];
}

export interface IAdminAnalyticsToolBucket {
    toolId: string;
    toolName: string;
    value: number;
}

export interface IAdminAnalyticsRalphBucket {
    ralphId: string;
    ralphName: string;
    value: number;
}

export interface IAdminAnalyticsRalphStepBucket {
    stepPosition: number;
    stoppedCount: number;
}

export interface IAdminAnalyticsRalphStepBreakdown {
    ralphId: string;
    ralphName: string;
    totalStops: number;
    completedCount: number;
    stopsByStep: IAdminAnalyticsRalphStepBucket[];
}
