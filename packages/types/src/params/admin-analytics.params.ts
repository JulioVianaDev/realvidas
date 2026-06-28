import { AdminAnalyticsTimeRangeType } from "../entities/admin-analytics.entity-type";

/**
 * Query-string params accepted by every admin-analytics endpoint.
 * NestJS `@Query()` decodes repeated keys as arrays natively, so
 * `?aiIds=a&aiIds=b` hydrates `aiIds: ['a','b']`.
 */
export interface IAdminAnalyticsBaseParams {
    tenantId?: string;
    enterpriseIds?: string[];
    aiModels?: string[];
    aiIds?: string[];
    socialMediaIds?: string[];
    range?: AdminAnalyticsTimeRangeType;
}

export interface IAdminAnalyticsFilterListParams {
    /** Optional scoping when listing ais/enterprises/tools for dropdown population. */
    tenantId?: string;
    enterpriseIds?: string[];
}
