import { API_ROUTES } from "@/api";
import type { GetUsersParams } from "@global-types/params/user.params";
import type { IGetEnterprisesParams, IGetMyEnterprisesParams } from "@global-types/params/enterprise.params";
import type { IGetEnterpriseMembersParams } from "@global-types/params/enterprise-member.params";
import type { IGetAllAiRalphsParams } from "@global-types/params/ai-ralph.params";
import type { IGetAllAiToolsParams } from "@global-types/params/ai-tool.params";
import type { IGetAllAssistantsParams } from "@global-types/params/assistant.params";
import type { IGetAllPivotAiToolsParams } from "@global-types/params/pivot-ai-tool.params";
import type { IGetCalendarsParams } from "@global-types/params/calendar.params";
import type { IGetEnterpriseEventsParams } from "@global-types/params/calendar-event.params";
import type { IGetAllCatalogCategoriesParams } from "@global-types/params/catalog-category.params";
import type { IGetAllCombosParams } from "@global-types/params/combo.params";
import type { IGetAllCustomersParams } from "@global-types/params/customer.params";
import type { IGetAllCampaignsParams } from "@global-types/params/campaign.params";
import type { IGetAllOrdersParams } from "@global-types/params/order.params";
import type { IGetAllProductsParams } from "@global-types/params/product.params";
import type { IGetAllSocialMidiasParams } from "@global-types/params/social-midia.params";
import type { IGetTrialsParams } from "@global-types/params/trial.params";
import type { IGetAllPaymentsParams, IGetPaymentStatsParams, IGetVerifyStripeCheckoutSessionParams } from "@global-types/params/payment.params";
import type { IGetAllSubscriptionsParams, IGetSubscriptionsForCurrentTenantParams } from "@global-types/params/subscription.params";
import type { IGetAllPlansParams, IGetActivePlansParams } from "@global-types/params/plan.params";
import type { IGetAllCreditTransactionsParams } from "@global-types/params/credit.params";
import type { IGetAllPipelinesParams, IGetAllPipelineColumnsParams } from "@global-types/params/pipeline.params";
import type { IGetAllOfferingCategoriesParams } from "@global-types/params/offering-category.params";
import type { IGetAllOfferingProfessionalsParams } from "@global-types/params/offering-professional.params";
import type { IGetAllOfferingServicesParams } from "@global-types/params/offering-service.params";
import type { IAdminAnalyticsBaseParams, IAdminAnalyticsFilterListParams } from "@global-types/params/admin-analytics.params";
import type { ConversationStatusType } from "@global-types/entities/conversation.entity-type";
import type { IGetAllPaymentProviderAccountsParams } from "@global-types/params/payment-provider-account.params";

export const queryKeys = {
    user: {
        all: () => [API_ROUTES.USERS.GET] as const,
        list: (p: GetUsersParams) => [API_ROUTES.USERS.GET, "list", p] as const,
        detail: (id: string) => [API_ROUTES.USERS.GET, "detail", id] as const,
    },

    enterprise: {
        all: () => [API_ROUTES.ENTERPRISE.GET_ALL] as const,
        list: (p: IGetEnterprisesParams) => [API_ROUTES.ENTERPRISE.GET_ALL, "list", p] as const,
        my: () => [API_ROUTES.ENTERPRISE.GET_MY] as const,
        myList: (p: IGetMyEnterprisesParams) => [API_ROUTES.ENTERPRISE.GET_MY, "list", p] as const,
        adminTenants: () => [API_ROUTES.ENTERPRISE.ADMIN_LIST_TENANTS] as const,
        byTenant: (tenantId: string) => [API_ROUTES.ENTERPRISE.GET_ALL, "by-tenant", tenantId] as const,
        detail: (id: string) => [API_ROUTES.ENTERPRISE.GET_ALL, "detail", id] as const,
        bySlug: (slug: string) => [API_ROUTES.ENTERPRISE.GET_ALL, "by-slug", slug] as const,
    },

    enterpriseMember: {
        all: () => [API_ROUTES.ENTERPRISE_MEMBER.GET_ALL] as const,
        list: (p: IGetEnterpriseMembersParams) => [API_ROUTES.ENTERPRISE_MEMBER.GET_ALL, "list", p] as const,
    },

    aiRalph: {
        all: () => [API_ROUTES.AI_RALPH.GET_ALL] as const,
        list: (p: IGetAllAiRalphsParams) => [API_ROUTES.AI_RALPH.GET_ALL, "list", p] as const,
        detail: (id: string, enterpriseId: string) => [API_ROUTES.AI_RALPH.GET_ALL, "detail", id, enterpriseId] as const,
    },

    aiTool: {
        all: () => [API_ROUTES.AI_TOOL.GET_ALL] as const,
        list: (p: IGetAllAiToolsParams) => [API_ROUTES.AI_TOOL.GET_ALL, "list", p] as const,
        detail: (id: string, enterpriseId: string) => [API_ROUTES.AI_TOOL.GET_ALL, "detail", id, enterpriseId] as const,
    },

    assistant: {
        all: () => [API_ROUTES.ASSISTANT.GET_ALL] as const,
        list: (p: IGetAllAssistantsParams) => [API_ROUTES.ASSISTANT.GET_ALL, "list", p] as const,
        detail: (id: string, enterpriseId: string) => [API_ROUTES.ASSISTANT.GET_ALL, "detail", id, enterpriseId] as const,
    },

    pivotAiTool: {
        all: () => [API_ROUTES.PIVOT_AI_TOOL.GET_ALL] as const,
        list: (p: IGetAllPivotAiToolsParams) =>
            [API_ROUTES.PIVOT_AI_TOOL.GET_ALL, "list", p] as const,
    },

    calendar: {
        all: () => [API_ROUTES.CALENDAR.GET_ALL] as const,
        list: (p: IGetCalendarsParams) => [API_ROUTES.CALENDAR.GET_ALL, "list", p] as const,
        detail: (id: string) => [API_ROUTES.CALENDAR.GET_ALL, "detail", id] as const,
    },

    calendarEvent: {
        all: () => [API_ROUTES.CALENDAR_EVENT.GET_ENTERPRISE_EVENTS] as const,
        enterpriseEvents: (p: Omit<IGetEnterpriseEventsParams, "page" | "pageSize">) =>
            [API_ROUTES.CALENDAR_EVENT.GET_ENTERPRISE_EVENTS, "list", p] as const,
    },

    catalogCategory: {
        all: () => [API_ROUTES.CATALOG_CATEGORY.GET_ALL] as const,
        list: (p: IGetAllCatalogCategoriesParams) => [API_ROUTES.CATALOG_CATEGORY.GET_ALL, "list", p] as const,
        detail: (id: string, enterpriseId: string) => [API_ROUTES.CATALOG_CATEGORY.GET_ALL, "detail", id, enterpriseId] as const,
    },

    combo: {
        all: () => [API_ROUTES.COMBO.GET_ALL] as const,
        list: (p: IGetAllCombosParams) => [API_ROUTES.COMBO.GET_ALL, "list", p] as const,
        detail: (id: string, enterpriseId: string) => [API_ROUTES.COMBO.GET_ALL, "detail", id, enterpriseId] as const,
    },

    conversation: {
        all: () => [API_ROUTES.CONVERSATION.GET_ALL] as const,
        list: (p: { enterpriseId: string; search?: string; status?: ConversationStatusType }) =>
            [API_ROUTES.CONVERSATION.GET_ALL, "list", p] as const,
        detail: (id: string, enterpriseId: string) =>
            [API_ROUTES.CONVERSATION.GET_ALL, "detail", id, enterpriseId] as const,
        messages: () => [API_ROUTES.CONVERSATION.GET_MESSAGES] as const,
        messagesList: (p: { enterpriseId: string; customerId: string }) =>
            [API_ROUTES.CONVERSATION.GET_MESSAGES, "list", p] as const,
        aiList: (p: { enterpriseId: string; assistantId: string; search?: string }) =>
            [API_ROUTES.CONVERSATION.GET_AI, "list", p] as const,
        mineList: (p: { enterpriseId: string; search?: string }) =>
            [API_ROUTES.CONVERSATION.GET_MINE, "list", p] as const,
        conversationMessages: (conversationId: string, enterpriseId: string) =>
            [API_ROUTES.CONVERSATION.GET_CONVERSATION_MESSAGES(conversationId), "list", enterpriseId] as const,
    },

    credit: {
        all: () => [API_ROUTES.CREDIT.GET_BALANCE] as const,
        balance: () => [API_ROUTES.CREDIT.GET_BALANCE, "balance"] as const,
        transactions: () => [API_ROUTES.CREDIT.GET_TRANSACTIONS] as const,
        transactionsList: (p: IGetAllCreditTransactionsParams) =>
            [API_ROUTES.CREDIT.GET_TRANSACTIONS, "list", p] as const,
    },

    customer: {
        all: () => [API_ROUTES.CUSTOMER.GET_ALL] as const,
        list: (p: IGetAllCustomersParams) => [API_ROUTES.CUSTOMER.GET_ALL, "list", p] as const,
        detail: (id: string, enterpriseId: string) => [API_ROUTES.CUSTOMER.GET_ALL, "detail", id, enterpriseId] as const,
    },

    campaign: {
        all: () => [API_ROUTES.CAMPAIGN.GET_ALL] as const,
        list: (p: IGetAllCampaignsParams) => [API_ROUTES.CAMPAIGN.GET_ALL, "list", p] as const,
        detail: (id: string, enterpriseId: string) => [API_ROUTES.CAMPAIGN.GET_ALL, "detail", id, enterpriseId] as const,
        report: (id: string, enterpriseId: string) => [API_ROUTES.CAMPAIGN.GET_REPORT(id), enterpriseId] as const,
        recipients: (id: string, enterpriseId: string, page: number) =>
            [API_ROUTES.CAMPAIGN.GET_RECIPIENTS(id), enterpriseId, page] as const,
    },

    offering: {
        category: {
            all: () => [API_ROUTES.OFFERING_CATEGORY.GET_ALL] as const,
            list: (p: IGetAllOfferingCategoriesParams) => [API_ROUTES.OFFERING_CATEGORY.GET_ALL, "list", p] as const,
            detail: (id: string, enterpriseId: string) => [API_ROUTES.OFFERING_CATEGORY.GET_ALL, "detail", id, enterpriseId] as const,
        },
        professional: {
            all: () => [API_ROUTES.OFFERING_PROFESSIONAL.GET_ALL] as const,
            list: (p: IGetAllOfferingProfessionalsParams) => [API_ROUTES.OFFERING_PROFESSIONAL.GET_ALL, "list", p] as const,
            detail: (id: string, enterpriseId: string) => [API_ROUTES.OFFERING_PROFESSIONAL.GET_ALL, "detail", id, enterpriseId] as const,
        },
        service: {
            all: () => [API_ROUTES.OFFERING_SERVICE.GET_ALL] as const,
            list: (p: IGetAllOfferingServicesParams) => [API_ROUTES.OFFERING_SERVICE.GET_ALL, "list", p] as const,
            detail: (id: string, enterpriseId: string) => [API_ROUTES.OFFERING_SERVICE.GET_ALL, "detail", id, enterpriseId] as const,
        },
        public: {
            services: (tenantId: string, p: IGetAllOfferingServicesParams) =>
                [API_ROUTES.PUBLIC.OFFERING_SERVICES, "list", tenantId, p] as const,
            categories: (tenantId: string, p: IGetAllOfferingCategoriesParams) =>
                [API_ROUTES.PUBLIC.OFFERING_CATEGORIES, "list", tenantId, p] as const,
            professionals: (tenantId: string, p: IGetAllOfferingProfessionalsParams) =>
                [API_ROUTES.PUBLIC.OFFERING_PROFESSIONALS, "list", tenantId, p] as const,
        },
    },

    order: {
        all: () => [API_ROUTES.ORDER.GET_ALL] as const,
        list: (p: IGetAllOrdersParams) => [API_ROUTES.ORDER.GET_ALL, "list", p] as const,
        detail: (id: string, enterpriseId: string) => [API_ROUTES.ORDER.GET_ALL, "detail", id, enterpriseId] as const,
    },

    payment: {
        all: () => [API_ROUTES.PAYMENT.GET_ALL] as const,
        list: (p: IGetAllPaymentsParams) => [API_ROUTES.PAYMENT.GET_ALL, "list", p] as const,
        detail: (id: string) => [API_ROUTES.PAYMENT.GET_ALL, "detail", id] as const,
        stats: () => [API_ROUTES.PAYMENT.GET_STATS] as const,
        statsList: (p: IGetPaymentStatsParams) => [API_ROUTES.PAYMENT.GET_STATS, "list", p] as const,
        verifyCheckout: (p: IGetVerifyStripeCheckoutSessionParams) =>
            [API_ROUTES.PAYMENT.VERIFY_STRIPE_CHECKOUT_SESSION, "verify", p] as const,
    },

    pipeline: {
        all: () => [API_ROUTES.PIPELINE.GET_ALL] as const,
        list: (p: IGetAllPipelinesParams) => [API_ROUTES.PIPELINE.GET_ALL, "list", p] as const,
        detail: (id: string, enterpriseId: string) => [API_ROUTES.PIPELINE.GET_ALL, "detail", id, enterpriseId] as const,
        column: {
            all: () => [API_ROUTES.PIPELINE_COLUMN.GET_ALL] as const,
            list: (p: IGetAllPipelineColumnsParams) => [API_ROUTES.PIPELINE_COLUMN.GET_ALL, "list", p] as const,
        },
        card: {
            all: () => [API_ROUTES.PIPELINE_CARD.GET_ALL] as const,
            list: (p: { enterpriseId: string; columnId: string }) =>
                [API_ROUTES.PIPELINE_CARD.GET_ALL, "list", p] as const,
        },
    },

    plan: {
        all: () => [API_ROUTES.PLAN.GET_ALL] as const,
        list: (p: IGetAllPlansParams) => [API_ROUTES.PLAN.GET_ALL, "list", p] as const,
        public: (p: IGetAllPlansParams) => [API_ROUTES.PLAN.GET_PUBLIC, "list", p] as const,
        active: (p?: IGetActivePlansParams) => [API_ROUTES.PLAN.GET_ACTIVE, "list", p] as const,
        detail: (id: string) => [API_ROUTES.PLAN.GET_ALL, "detail", id] as const,
        byName: (name: string) => [API_ROUTES.PLAN.GET_ALL, "by-name", name] as const,
    },

    product: {
        all: () => [API_ROUTES.PRODUCT.GET_ALL] as const,
        list: (p: IGetAllProductsParams) => [API_ROUTES.PRODUCT.GET_ALL, "list", p] as const,
        detail: (id: string, enterpriseId: string) => [API_ROUTES.PRODUCT.GET_ALL, "detail", id, enterpriseId] as const,
    },

    publicCatalog: {
        products: (tenantId: string, p: IGetAllProductsParams) =>
            [API_ROUTES.PUBLIC.CATALOG_PRODUCTS, "list", tenantId, p] as const,
        categories: (tenantId: string, p: IGetAllCatalogCategoriesParams) =>
            [API_ROUTES.PUBLIC.CATALOG_CATEGORIES, "list", tenantId, p] as const,
        combos: (tenantId: string, p: IGetAllCombosParams) =>
            [API_ROUTES.PUBLIC.CATALOG_COMBOS, "list", tenantId, p] as const,
    },

    socialMidia: {
        all: () => [API_ROUTES.SOCIAL_MIDIA.GET_ALL] as const,
        list: (p: IGetAllSocialMidiasParams) => [API_ROUTES.SOCIAL_MIDIA.GET_ALL, "list", p] as const,
        detail: (id: number, enterpriseId: string) => [API_ROUTES.SOCIAL_MIDIA.GET_ALL, "detail", id, enterpriseId] as const,
    },

    subscription: {
        all: () => [API_ROUTES.SUBSCRIPTION.GET_ALL] as const,
        list: (p: IGetAllSubscriptionsParams) => [API_ROUTES.SUBSCRIPTION.GET_ALL, "list", p] as const,
        me: () => [API_ROUTES.SUBSCRIPTION.GET_ME] as const,
        meList: (p: IGetSubscriptionsForCurrentTenantParams) =>
            [API_ROUTES.SUBSCRIPTION.GET_ME, "list", p] as const,
        meCurrent: () => [API_ROUTES.SUBSCRIPTION.GET_ME_CURRENT] as const,
    },

    trial: {
        all: () => [API_ROUTES.TRIAL.GET_ALL] as const,
        list: (p: IGetTrialsParams) => [API_ROUTES.TRIAL.GET_ALL, "list", p] as const,
        detail: (id: string) => [API_ROUTES.TRIAL.GET_ALL, "detail", id] as const,
        my: () => [API_ROUTES.TRIAL.GET_MY] as const,
    },

    urlShortener: {
        resolve: (shortPath: string) => ["public-short-path", shortPath] as const,
        checkAvailability: (path: string, excludeEnterpriseId?: string) =>
            ["short-path-available", path, excludeEnterpriseId] as const,
    },

    paymentProviderAccount: {
        all: () => [API_ROUTES.PAYMENT_PROVIDER_ACCOUNT.GET_ALL] as const,
        list: (p: IGetAllPaymentProviderAccountsParams) =>
            [API_ROUTES.PAYMENT_PROVIDER_ACCOUNT.GET_ALL, "list", p] as const,
        detail: (id: string) =>
            [API_ROUTES.PAYMENT_PROVIDER_ACCOUNT.GET_ALL, "detail", id] as const,
    },

    adminSaas: {
        all: () => [API_ROUTES.ADMIN_SAAS.TENANTS] as const,
        tenants: () => [API_ROUTES.ADMIN_SAAS.TENANTS, "list"] as const,
        tenantBilling: (tenantId: string) =>
            [API_ROUTES.ADMIN_SAAS.TENANTS, "billing", tenantId] as const,
    },

    adminAnalytics: {
        all: () => ["admin-analytics"] as const,
        filters: (p: IAdminAnalyticsFilterListParams) => ["admin-analytics", "filters", p] as const,
        report: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "report", p] as const,
        ai: {
            tokensOverTime: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "ai", "tokens-over-time", p] as const,
            toolsUsage: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "ai", "tools-usage", p] as const,
            messages: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "ai", "messages", p] as const,
            conversations: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "ai", "conversations", p] as const,
            avgMessagesPerConversation: (p: IAdminAnalyticsBaseParams) =>
                ["admin-analytics", "ai", "avg-messages-per-conversation", p] as const,
            profitPercentage: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "ai", "profit-percentage", p] as const,
            profitTotal: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "ai", "profit-total", p] as const,
            avgCostPerMessage: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "ai", "avg-cost-per-message", p] as const,
            totalCost: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "ai", "total-cost", p] as const,
            avgCostPerConversation: (p: IAdminAnalyticsBaseParams) =>
                ["admin-analytics", "ai", "avg-cost-per-conversation", p] as const,
        },
        tools: {
            usageCount: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "tools", "usage-count", p] as const,
            conversationsCount: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "tools", "conversations-count", p] as const,
        },
        ralphs: {
            mostUsed: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "ralphs", "most-used", p] as const,
            stopsByStep: (p: IAdminAnalyticsBaseParams) => ["admin-analytics", "ralphs", "stops-by-step", p] as const,
        },
    },
    tenantAnalytics: {
        report: (p: Omit<IAdminAnalyticsBaseParams, 'tenantId'>) => ["tenant-analytics", "report", p] as const,
        filters: () => ["tenant-analytics", "filters"] as const,
    },
} as const;
