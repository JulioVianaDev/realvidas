import { API_ROUTES } from "@/api";
import api from "@/axios/axios.v1";
import {
    IAdminAnalyticsBaseParams,
    IAdminAnalyticsFilterListParams,
} from "@global-types/params/admin-analytics.params";
import {
    IAdminAnalyticsAiAverageCostPerConversationResponse,
    IAdminAnalyticsAiAverageCostPerMessageResponse,
    IAdminAnalyticsAiAverageMessagesPerConversationResponse,
    IAdminAnalyticsAiConversationsResponse,
    IAdminAnalyticsAiMessagesResponse,
    IAdminAnalyticsAiProfitPercentageResponse,
    IAdminAnalyticsAiProfitTotalResponse,
    IAdminAnalyticsAiTokensOverTimeResponse,
    IAdminAnalyticsAiToolsUsageResponse,
    IAdminAnalyticsAiTotalCostResponse,
    IAdminAnalyticsFiltersResponse,
    IAdminAnalyticsRalphsMostUsedResponse,
    IAdminAnalyticsRalphsStopsByStepResponse,
    IAdminAnalyticsReportResponse,
    IAdminAnalyticsToolsConversationsCountResponse,
    IAdminAnalyticsToolsUsageCountResponse,
} from "@global-types/responses/admin-analytics.response";

const baseParams = (
    filters: IAdminAnalyticsBaseParams,
): Record<string, unknown> => ({
    tenantId: filters.tenantId,
    enterpriseIds: filters.enterpriseIds,
    aiModels: filters.aiModels,
    aiIds: filters.aiIds,
    socialMediaIds: filters.socialMediaIds,
    range: filters.range,
});

export const getAdminAnalyticsFiltersAction = async (
    params: IAdminAnalyticsFilterListParams,
): Promise<IAdminAnalyticsFiltersResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.FILTERS, { params });

export const getAdminAnalyticsReportAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsReportResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.REPORT, {
        params: baseParams(filters),
    });

export const getAiTokensOverTimeAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsAiTokensOverTimeResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.AI.TOKENS_OVER_TIME, {
        params: baseParams(filters),
    });

export const getAiToolsUsageAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsAiToolsUsageResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.AI.TOOLS_USAGE, {
        params: baseParams(filters),
    });

export const getAiMessagesAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsAiMessagesResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.AI.MESSAGES, {
        params: baseParams(filters),
    });

export const getAiConversationsAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsAiConversationsResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.AI.CONVERSATIONS, {
        params: baseParams(filters),
    });

export const getAiAvgMessagesPerConversationAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsAiAverageMessagesPerConversationResponse> =>
    api.get(
        API_ROUTES.ADMIN_ANALYTICS.AI.AVG_MESSAGES_PER_CONVERSATION,
        { params: baseParams(filters) },
    );

export const getAiProfitPercentageAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsAiProfitPercentageResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.AI.PROFIT_PERCENTAGE, {
        params: baseParams(filters),
    });

export const getAiProfitTotalAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsAiProfitTotalResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.AI.PROFIT_TOTAL, {
        params: baseParams(filters),
    });

export const getAiAvgCostPerMessageAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsAiAverageCostPerMessageResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.AI.AVG_COST_PER_MESSAGE, {
        params: baseParams(filters),
    });

export const getAiTotalCostAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsAiTotalCostResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.AI.TOTAL_COST, {
        params: baseParams(filters),
    });

export const getAiAvgCostPerConversationAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsAiAverageCostPerConversationResponse> =>
    api.get(
        API_ROUTES.ADMIN_ANALYTICS.AI.AVG_COST_PER_CONVERSATION,
        { params: baseParams(filters) },
    );

export const getToolsUsageCountAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsToolsUsageCountResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.TOOLS.USAGE_COUNT, {
        params: baseParams(filters),
    });

export const getToolsConversationsCountAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsToolsConversationsCountResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.TOOLS.CONVERSATIONS_COUNT, {
        params: baseParams(filters),
    });

export const getRalphsMostUsedAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsRalphsMostUsedResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.RALPHS.MOST_USED, {
        params: baseParams(filters),
    });

export const getRalphsStopsByStepAction = async (
    filters: IAdminAnalyticsBaseParams,
): Promise<IAdminAnalyticsRalphsStopsByStepResponse> =>
    api.get(API_ROUTES.ADMIN_ANALYTICS.RALPHS.STOPS_BY_STEP, {
        params: baseParams(filters),
    });
