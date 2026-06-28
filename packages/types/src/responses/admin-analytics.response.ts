import {
    AdminAnalyticsTimeRangeType,
    IAdminAnalyticsAiBucket,
    IAdminAnalyticsAiTimeSeriesSeries,
    IAdminAnalyticsRalphBucket,
    IAdminAnalyticsRalphStepBreakdown,
    IAdminAnalyticsToolBucket,
} from "../entities/admin-analytics.entity-type";

/** ─────────────────────── AI graphs (1-10) ────────────────────────────── */

export interface IAdminAnalyticsAiTokensOverTimeResponse {
    range: AdminAnalyticsTimeRangeType;
    series: IAdminAnalyticsAiTimeSeriesSeries[];
}

export interface IAdminAnalyticsAiToolsUsageResponse {
    range: AdminAnalyticsTimeRangeType;
    ais: IAdminAnalyticsAiBucket[];
}

export interface IAdminAnalyticsAiMessagesResponse {
    range: AdminAnalyticsTimeRangeType;
    ais: IAdminAnalyticsAiBucket[];
}

export interface IAdminAnalyticsAiConversationsResponse {
    range: AdminAnalyticsTimeRangeType;
    ais: IAdminAnalyticsAiBucket[];
}

export interface IAdminAnalyticsAiAverageMessagesPerConversationResponse {
    range: AdminAnalyticsTimeRangeType;
    ais: IAdminAnalyticsAiBucket[];
}

export interface IAdminAnalyticsAiProfitPercentageResponse {
    range: AdminAnalyticsTimeRangeType;
    ais: (IAdminAnalyticsAiBucket & {
        totalSellUsd: number;
        totalCostUsd: number;
        totalWonUsd: number;
        profitPercentage: number;
    })[];
}

export interface IAdminAnalyticsAiProfitTotalResponse {
    range: AdminAnalyticsTimeRangeType;
    ais: (IAdminAnalyticsAiBucket & {
        totalSellUsd: number;
        totalCostUsd: number;
        totalWonUsd: number;
    })[];
}

export interface IAdminAnalyticsAiAverageCostPerMessageResponse {
    range: AdminAnalyticsTimeRangeType;
    ais: IAdminAnalyticsAiBucket[];
}

export interface IAdminAnalyticsAiTotalCostResponse {
    range: AdminAnalyticsTimeRangeType;
    ais: IAdminAnalyticsAiBucket[];
}

export interface IAdminAnalyticsAiAverageCostPerConversationResponse {
    range: AdminAnalyticsTimeRangeType;
    ais: IAdminAnalyticsAiBucket[];
}

/** ─────────────────────── Tools graphs (1-2) ──────────────────────────── */

export interface IAdminAnalyticsToolsUsageCountResponse {
    range: AdminAnalyticsTimeRangeType;
    tools: IAdminAnalyticsToolBucket[];
}

export interface IAdminAnalyticsToolsConversationsCountResponse {
    range: AdminAnalyticsTimeRangeType;
    tools: IAdminAnalyticsToolBucket[];
}

/** ─────────────────────── Ralph graphs (1-2) ──────────────────────────── */

export interface IAdminAnalyticsRalphsMostUsedResponse {
    range: AdminAnalyticsTimeRangeType;
    ralphs: IAdminAnalyticsRalphBucket[];
}

export interface IAdminAnalyticsRalphsStopsByStepResponse {
    range: AdminAnalyticsTimeRangeType;
    ralphs: IAdminAnalyticsRalphStepBreakdown[];
}

/** ─────────────────────── Dropdown filters ────────────────────────────── */

export interface IAdminAnalyticsTenantOption {
    id: string;
}

export interface IAdminAnalyticsEnterpriseOption {
    id: string;
    tenantId: string;
    name: string;
}

export interface IAdminAnalyticsAiOption {
    id: string;
    tenantId: string;
    enterpriseId: string;
    name: string;
    aiModel: string;
}

export interface IAdminAnalyticsModelOption {
    aiModel: string;
}

export interface IAdminAnalyticsSocialMediaOption {
    id: string;
}

export interface IAdminAnalyticsFiltersResponse {
    tenants: IAdminAnalyticsTenantOption[];
    enterprises: IAdminAnalyticsEnterpriseOption[];
    ais: IAdminAnalyticsAiOption[];
    models: IAdminAnalyticsModelOption[];
    socialMedias: IAdminAnalyticsSocialMediaOption[];
}

/** ─────────────────────── Combined report ─────────────────────────────── */

export interface IAdminAnalyticsReportResponse {
    range: AdminAnalyticsTimeRangeType;
    ai: {
        tokensOverTime: IAdminAnalyticsAiTokensOverTimeResponse;
        toolsUsage: IAdminAnalyticsAiToolsUsageResponse;
        messages: IAdminAnalyticsAiMessagesResponse;
        conversations: IAdminAnalyticsAiConversationsResponse;
        averageMessagesPerConversation: IAdminAnalyticsAiAverageMessagesPerConversationResponse;
        profitPercentage: IAdminAnalyticsAiProfitPercentageResponse;
        profitTotal: IAdminAnalyticsAiProfitTotalResponse;
        averageCostPerMessage: IAdminAnalyticsAiAverageCostPerMessageResponse;
        totalCost: IAdminAnalyticsAiTotalCostResponse;
        averageCostPerConversation: IAdminAnalyticsAiAverageCostPerConversationResponse;
    };
    tools: {
        usageCount: IAdminAnalyticsToolsUsageCountResponse;
        conversationsCount: IAdminAnalyticsToolsConversationsCountResponse;
    };
    ralphs: {
        mostUsed: IAdminAnalyticsRalphsMostUsedResponse;
        stopsByStep: IAdminAnalyticsRalphsStopsByStepResponse;
    };
}
