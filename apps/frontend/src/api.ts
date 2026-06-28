export const API_ROUTES = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        REGISTER_VERIFY_CODE: "/auth/register/verify-code",
        REGISTER_CONFIRM_EMAIL: "/auth/register/confirm-email",
        REGISTER_RESEND_CODE: "/auth/register/resend-code",
        REGISTER_RESEND_FROM_LINK: "/auth/register/resend-from-link",
        REGISTER_LINK_CONTEXT: "/auth/register/link-context",
        GOOGLE: "/auth/google",
    },
    USERS: {
        GET: "/users",
        PATCH_ME_UI_PREFERENCES: "/users/me/ui-preferences",
        PATCH_ME_CURRENT_TENANT: "/users/me/current-tenant",
        EDIT: (id: string) => `/users/edit/${id}`,
        CREATE: "/users/create",
        DELETE: (id: string) => `/users/delete/${id}`,
        IMPORT_FILE: "/users/import-by-file",
        GET_BY_ID: (id: string) => `/users/${id}`,
        RESET_PASSWORD: (id: string) => `/users/reset-password/${id}`,
    },
    FILE: {
        SAVE: "/files",
        SAVE_BY_URL: "/files/url",
        DELETE: (id: string) => `/files/${id}`,
        GET: (id: string) => `/files/${id}`,
        GET_ALL: "/files",
    },
    ENTERPRISE: {
        CREATE: "enterprises",
        GET_ALL: "enterprises",
        GET_MY: "enterprises/my",
        ADMIN_LIST_TENANTS: "enterprises/admin/tenants",
        GET_BY_TENANT: (tenantId: string) =>
            `enterprises/tenants/${tenantId}/enterprises`,
        GET_BY_ID: (id: string) => `enterprises/${id}`,
        GET_BY_SLUG: (slug: string) => `enterprises/slug/${slug}`,
        CHECK_SHORT_PATH: "enterprises/short-path/check",
        UPDATE: (id: string) => `enterprises/${id}`,
        DELETE: (id: string) => `enterprises/${id}`,
        TRANSFER_OWNERSHIP: (id: string) =>
            `enterprises/${id}/transfer-ownership`,
        UPDATE_GOOGLE_TOKENS: (id: string) =>
            `enterprises/${id}/google-tokens`,
    },
    ENTERPRISE_MEMBER: {
        GET_ALL: "enterprise-members",
        GET_BY_ID: (id: string) => `enterprise-members/${id}`,
        ADD: (enterpriseId: string) =>
            `enterprise-members/${enterpriseId}`,
        UPDATE: (id: string) => `enterprise-members/${id}`,
        REMOVE: (id: string) => `enterprise-members/${id}`,
    },
    PROFILE: {
        GET_ALL: "profiles",
        GET_MINE: "profiles/me",
        GET_BY_ID: (id: string) => `profiles/${id}`,
        CREATE: "profiles",
        UPDATE: (id: string) => `profiles/${id}`,
        DELETE: (id: string) => `profiles/${id}`,
        GET_BY_USER: (userId: string) => `profiles/user/${userId}`,
        ASSIGN: "profiles/assign",
    },
    ENTERPRISE_INVITATION: {
        CREATE: (enterpriseId: string) =>
            `enterprise-invitations/${enterpriseId}`,
        GET_ALL: "enterprise-invitations",
        GET_MY: "enterprise-invitations/my",
        GET_BY_TOKEN: (token: string) =>
            `enterprise-invitations/token/${token}`,
        ACCEPT: (token: string) =>
            `enterprise-invitations/token/${token}/accept`,
        DECLINE: (token: string) =>
            `enterprise-invitations/token/${token}/decline`,
        CANCEL: (token: string) =>
            `enterprise-invitations/token/${token}`,
    },
    CALENDAR: {
        CREATE: (enterpriseId: string) => `calendars/${enterpriseId}`,
        GET_ALL: "calendars",
        GET_MY: "calendars/my",
        GET_BY_ID: (id: string) => `calendars/${id}`,
        UPDATE: (id: string) => `calendars/${id}`,
        DELETE: (id: string) => `calendars/${id}`,
        SYNC: (enterpriseId: string) =>
            `calendars/${enterpriseId}/sync`,
    },
    CALENDAR_EVENT: {
        CREATE: (calendarId: string) =>
            `calendar-events/${calendarId}`,
        GET_ALL: "calendar-events",
        GET_MY_EVENTS: "calendar-events/my",
        GET_ENTERPRISE_EVENTS: "calendar-events/enterprise",
        GET_BY_ID: (id: string) => `calendar-events/${id}`,
        UPDATE: (id: string) => `calendar-events/${id}`,
        DELETE: (id: string) => `calendar-events/${id}`,
        SYNC: (calendarId: string) =>
            `calendar-events/${calendarId}/sync`,
    },
    CALENDAR_SHARE: {
        CREATE: (calendarId: string) =>
            `calendar-shares/${calendarId}`,
        GET_ALL: "calendar-shares",
        GET_MEMBER_SHARES: "calendar-shares/member",
        GET_BY_ID: (id: string) => `calendar-shares/${id}`,
        UPDATE: (id: string) => `calendar-shares/${id}`,
        DELETE: (id: string) => `calendar-shares/${id}`,
    },
    EMPLOYEE_GOOGLE_EMAIL: {
        ADD: (memberId: string) =>
            `employee-google-emails/${memberId}`,
        GET_ALL: "employee-google-emails",
        GET_BY_ID: (id: string) => `employee-google-emails/${id}`,
        AUTHORIZE: (id: string) =>
            `employee-google-emails/${id}/authorize`,
        UPDATE: (id: string) => `employee-google-emails/${id}`,
        DELETE: (id: string) => `employee-google-emails/${id}`,
    },
    TRIAL: {
        CREATE: "trials",
        GET_ALL: "trials",
        GET_BY_ID: (id: string) => `trials/${id}`,
        GET_MY: "trials/my",
        GET_BY_ENTERPRISE_AND_USER: (
            enterpriseId: string,
            userId: string,
        ) => `trials?enterpriseId=${enterpriseId}&userId=${userId}`,
        UPDATE: (id: string) => `trials/${id}`,
        DELETE: (id: string) => `trials/${id}`,
    },
    PAYMENT: {
        GET_ALL: "payments",
        GET_BY_ID: (id: string) => `payments/${id}`,
        GET_STATS: "payments/stats",
        VERIFY_STRIPE_CHECKOUT_SESSION:
            "payments/checkout-session/verify",
        CREATE: "payments",
        UPDATE: (id: string) => `payments/${id}`,
        CHECK_STATUS: (id: string) => `payments/${id}/check-status`,
        CANCEL: (id: string) => `payments/${id}/cancel`,
        REFUND: (id: string) => `payments/${id}/refund`,
    },
    SUBSCRIPTION: {
        GET_ALL: "subscriptions",
        /** Current session’s subscriptions (tenant from server CLS, not from the client). */
        GET_ME: "subscriptions/me",
        GET_ME_CURRENT: "subscriptions/me/current",
        GET_BY_ID: (id: string) => `subscriptions/${id}`,
        GET_WITH_PLAN: (id: string) =>
            `subscriptions/${id}/with-plan`,
        CREATE: "subscriptions",
        CHECKOUT: "subscriptions/checkout",
        UPDATE: (id: string) => `subscriptions/${id}`,
        CANCEL: (id: string) => `subscriptions/${id}/cancel`,
        REACTIVATE: (id: string) => `subscriptions/${id}/reactivate`,
    },
    PLAN: {
        GET_ALL: "plans",
        GET_PUBLIC: "plans/public",
        GET_ACTIVE: "plans/active",
        GET_BY_ID: (id: string) => `plans/${id}`,
        GET_BY_NAME: (name: string) => `plans/name/${name}`,
        CREATE: "plans",
        UPDATE: (id: string) => `plans/${id}`,
        DELETE: (id: string) => `plans/${id}`,
    },
    CUSTOM_PLAN: {
        GET_ALL: "custom-plans",
        GET_BY_ID: (id: string) => `custom-plans/${id}`,
        GET_BY_ENTERPRISE: (enterpriseId: string) =>
            `custom-plans/enterprise/${enterpriseId}`,
        CREATE: "custom-plans",
        UPDATE: (id: string) => `custom-plans/${id}`,
        DELETE: (id: string) => `custom-plans/${id}`,
    },
    ASSISTANT: {
        CREATE: "assistants",
        GET_ALL: "assistants",
        GET_BY_ID: (id: string) => `assistants/${id}`,
        UPDATE: (id: string) => `assistants/${id}`,
        DELETE: (id: string) => `assistants/${id}`,
    },
    SOCIAL_MIDIA: {
        CREATE: "social-midias",
        GET_ALL: "social-midias",
        GET_BY_ID: (id: number) => `social-midias/${id}`,
        UPDATE: (id: number) => `social-midias/${id}`,
        DELETE: (id: number) => `social-midias/${id}`,
        QR_CODE: (id: number) =>
            `social-midias/${id}/social-media-qr-code`,
    },
    START_USER_TENANT: {
        CREATE: "start-user-tenant",
    },
    AI_TOOL: {
        CREATE: "ai-tools",
        GET_ALL: "ai-tools",
        GET_BY_ID: (id: string) => `ai-tools/${id}`,
        UPDATE: (id: string) => `ai-tools/${id}`,
        DELETE: (id: string) => `ai-tools/${id}`,
    },
    AI_RALPH: {
        CREATE: "ai-ralphs",
        GET_ALL: "ai-ralphs",
        GET_BY_ID: (id: string) => `ai-ralphs/${id}`,
        CREATE_VERSION: (id: string) => `ai-ralphs/${id}/versions`,
        DELETE: (id: string) => `ai-ralphs/${id}`,
    },
    PIVOT_AI_TOOL: {
        CREATE: "pivot-ai-tools",
        GET_ALL: "pivot-ai-tools",
        SYNC: "pivot-ai-tools/sync",
        UPDATE: (id: string) => `pivot-ai-tools/${id}`,
        DELETE: (id: string) => `pivot-ai-tools/${id}`,
    },
    PIVOT_AI_RALPH: {
        CREATE: "pivot-ai-ralphs",
        GET_ALL: "pivot-ai-ralphs",
        UPDATE: (id: string) => `pivot-ai-ralphs/${id}`,
        DELETE: (id: string) => `pivot-ai-ralphs/${id}`,
    },
    CATALOG_CATEGORY: {
        CREATE: "catalog/categories",
        GET_ALL: "catalog/categories",
        GET_BY_ID: (id: string) => `catalog/categories/${id}`,
        UPDATE: (id: string) => `catalog/categories/${id}`,
        DELETE: (id: string) => `catalog/categories/${id}`,
    },
    PRODUCT: {
        CREATE: "catalog/products",
        GET_ALL: "catalog/products",
        GET_BY_ID: (id: string) => `catalog/products/${id}`,
        UPDATE: (id: string) => `catalog/products/${id}`,
        DELETE: (id: string) => `catalog/products/${id}`,
    },
    COMBO: {
        CREATE: "catalog/combos",
        GET_ALL: "catalog/combos",
        GET_BY_ID: (id: string) => `catalog/combos/${id}`,
        UPDATE: (id: string) => `catalog/combos/${id}`,
        DELETE: (id: string) => `catalog/combos/${id}`,
    },
    ORDER: {
        GET_ALL: "orders",
        GET_BY_ID: (id: string) => `orders/${id}`,
        UPDATE_STATUS: (id: string) => `orders/${id}/status`,
        DELETE: (id: string) => `orders/${id}`,
    },
    OFFERING_CATEGORY: {
        CREATE: "offerings/categories",
        GET_ALL: "offerings/categories",
        GET_BY_ID: (id: string) => `offerings/categories/${id}`,
        UPDATE: (id: string) => `offerings/categories/${id}`,
        DELETE: (id: string) => `offerings/categories/${id}`,
    },
    OFFERING_PROFESSIONAL: {
        CREATE: "offerings/professionals",
        GET_ALL: "offerings/professionals",
        GET_BY_ID: (id: string) => `offerings/professionals/${id}`,
        UPDATE: (id: string) => `offerings/professionals/${id}`,
        DELETE: (id: string) => `offerings/professionals/${id}`,
    },
    OFFERING_SERVICE: {
        CREATE: "offerings/services",
        GET_ALL: "offerings/services",
        GET_BY_ID: (id: string) => `offerings/services/${id}`,
        UPDATE: (id: string) => `offerings/services/${id}`,
        DELETE: (id: string) => `offerings/services/${id}`,
    },
    CONVERSATION: {
        GET_ALL: "conversations",
        GET_AI: "conversations/ai",
        GET_MINE: "conversations/mine",
        GET_BY_ID: (id: string) => `conversations/${id}`,
        GET_MESSAGES: "conversations/messages",
        GET_CONVERSATION_MESSAGES: (id: string) => `conversations/${id}/messages`,
        SEND_MESSAGE: (id: string) => `conversations/${id}/messages`,
        CLOSE: (id: string) => `conversations/${id}/close`,
    },
    CUSTOMER: {
        CREATE: "customers",
        MERGE: "customers/merge",
        GET_ALL: "customers",
        GET_BY_ID: (id: string) => `customers/${id}`,
        UPDATE: (id: string) => `customers/${id}`,
        DELETE: (id: string) => `customers/${id}`,
    },
    CAMPAIGN: {
        CREATE: "campaigns",
        GET_ALL: "campaigns",
        GET_BY_ID: (id: string) => `campaigns/${id}`,
        GET_REPORT: (id: string) => `campaigns/${id}/report`,
        GET_RECIPIENTS: (id: string) => `campaigns/${id}/recipients`,
        CSV_TEMPLATE: "campaigns/csv-template",
    },
    PUBLIC: {
        RESOLVE_TENANT: "public/resolve-tenant",
        RESOLVE_SHORT_PATH: (shortPath: string) =>
            `public/short-path/${shortPath}`,
        CREATE_ORDER: "public/orders",
        LOOKUP_ORDERS: "public/orders/lookup",
        CATALOG_PRODUCTS: "public/catalog/products",
        CATALOG_CATEGORIES: "public/catalog/categories",
        CATALOG_COMBOS: "public/catalog/combos",
        OFFERING_SERVICES: "public/offerings/services",
        OFFERING_CATEGORIES: "public/offerings/categories",
        OFFERING_PROFESSIONALS: "public/offerings/professionals",
    },
    PIPELINE: {
        CREATE: "pipelines",
        GET_ALL: "pipelines",
        GET_BY_ID: (id: string) => `pipelines/${id}`,
        UPDATE: (id: string) => `pipelines/${id}`,
        DELETE: (id: string) => `pipelines/${id}`,
    },
    PIPELINE_COLUMN: {
        CREATE: "pipelines/columns",
        GET_ALL: "pipelines/columns",
        UPDATE: (id: string) => `pipelines/columns/${id}`,
        DELETE: (id: string) => `pipelines/columns/${id}`,
    },
    PIPELINE_CARD: {
        CREATE: "pipelines/cards",
        GET_ALL: "pipelines/cards",
        UPDATE: (id: string) => `pipelines/cards/${id}`,
        DELETE: (id: string) => `pipelines/cards/${id}`,
        MOVE: (id: string) => `pipelines/cards/${id}/move`,
    },
    CREDIT: {
        GET_BALANCE: "credits/balance",
        GET_TRANSACTIONS: "credits/transactions",
        DEBIT: "credits/debit",
        INCREMENT: "credits/increment",
        MANUAL_ADJUSTMENT: "credits/manual-adjustment",
    },
    PAYMENT_PROVIDER_ACCOUNT: {
        CREATE: "payment-provider-accounts",
        GET_ALL: "payment-provider-accounts",
        GET_BY_ID: (id: string) => `payment-provider-accounts/${id}`,
        UPDATE: (id: string) => `payment-provider-accounts/${id}`,
        DELETE: (id: string) => `payment-provider-accounts/${id}`,
    },
    ADMIN_SAAS: {
        TENANTS: "admin-saas/tenants",
        TENANT_BILLING: (tenantId: string) =>
            `admin-saas/tenants/${tenantId}/billing`,
        SIMULATE_PAID: (paymentId: string) =>
            `admin-saas/payments/${paymentId}/simulate-paid`,
        GRANT_ACCESS: (tenantId: string) =>
            `admin-saas/tenants/${tenantId}/grant-access`,
    },
    ADMIN_ANALYTICS: {
        FILTERS: "/admin-analytics/filters",
        REPORT: "/admin-analytics/report",
        AI: {
            TOKENS_OVER_TIME: "/admin-analytics/ai/tokens-over-time",
            TOOLS_USAGE: "/admin-analytics/ai/tools-usage",
            MESSAGES: "/admin-analytics/ai/messages",
            CONVERSATIONS: "/admin-analytics/ai/conversations",
            AVG_MESSAGES_PER_CONVERSATION:
                "/admin-analytics/ai/avg-messages-per-conversation",
            PROFIT_PERCENTAGE:
                "/admin-analytics/ai/profit-percentage",
            PROFIT_TOTAL: "/admin-analytics/ai/profit-total",
            AVG_COST_PER_MESSAGE:
                "/admin-analytics/ai/avg-cost-per-message",
            TOTAL_COST: "/admin-analytics/ai/total-cost",
            AVG_COST_PER_CONVERSATION:
                "/admin-analytics/ai/avg-cost-per-conversation",
        },
        TOOLS: {
            USAGE_COUNT: "/admin-analytics/tools/usage-count",
            CONVERSATIONS_COUNT:
                "/admin-analytics/tools/conversations-count",
        },
        RALPHS: {
            MOST_USED: "/admin-analytics/ralphs/most-used",
            STOPS_BY_STEP: "/admin-analytics/ralphs/stops-by-step",
        },
    },
    TENANT_ANALYTICS: {
        REPORT: "/tenant-analytics/report",
        FILTERS: "/tenant-analytics/filters",
    },
};
