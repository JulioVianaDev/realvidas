import {
    IAiToolFieldType,
    IAiToolHttpMethod,
} from "../entities/ai-tool.entity-type";

/** Legacy DB rows only — outbound text is auto-queued by AiRouterService. */
export const DEPRECATED_SEND_MESSAGE_HANDLER_KEY =
    "mocked:sendMessage" as const;

export function isAgentCallableAiTool(handlerKey: string): boolean {
    return handlerKey !== DEPRECATED_SEND_MESSAGE_HANDLER_KEY;
}

export type IMockedAiToolCategoryId =
    | "calendar"
    | "scheduling"
    | "payments"
    | "crm"
    | "messaging";

export interface IMockedAiToolCategory {
    id: IMockedAiToolCategoryId;
    /** i18n key for the category label */
    nameKey: string;
    descriptionKey: string;
}

export interface IMockedAiToolCatalogBodyField {
    name: string;
    type: IAiToolFieldType;
    required: boolean;
    /** Step position inside the referenced mocked ralph catalog item */
    ralphStepPosition?: number;
}

export interface IMockedAiToolCatalogItem {
    /** Stable slug used in the public catalog (not a database id) */
    id: string;
    categoryId: IMockedAiToolCategoryId;
    handlerKey: string;
    /** camelCase name used for AI function calling */
    functionName: string;
    /** i18n key for the human-readable tool label */
    nameKey: string;
    /** i18n key for the tool description */
    descriptionKey: string;
    isHttpRequest: boolean;
    httpMethod: IAiToolHttpMethod | null;
    url: string | null;
    bodyFields: IMockedAiToolCatalogBodyField[];
    responseSchema: string;
    /** handlerKey of the mocked ralph catalog item this tool depends on */
    ralphRefHandlerKey: string | null;
}

export const MOCKED_AI_TOOL_CATEGORIES: IMockedAiToolCategory[] = [
    {
        id: "calendar",
        nameKey: "aiToolsPage.catalog.categories.calendar",
        descriptionKey: "aiToolsPage.catalog.categories.calendarDescription",
    },
    {
        id: "scheduling",
        nameKey: "aiToolsPage.catalog.categories.scheduling",
        descriptionKey:
            "aiToolsPage.catalog.categories.schedulingDescription",
    },
    {
        id: "payments",
        nameKey: "aiToolsPage.catalog.categories.payments",
        descriptionKey: "aiToolsPage.catalog.categories.paymentsDescription",
    },
    {
        id: "crm",
        nameKey: "aiToolsPage.catalog.categories.crm",
        descriptionKey: "aiToolsPage.catalog.categories.crmDescription",
    },
    {
        id: "messaging",
        nameKey: "aiToolsPage.catalog.categories.messaging",
        descriptionKey:
            "aiToolsPage.catalog.categories.messagingDescription",
    },
];

export const MOCKED_AI_TOOL_CATALOG: IMockedAiToolCatalogItem[] = [
    {
        id: "check_calendar_days_free",
        categoryId: "calendar",
        handlerKey: "mocked:checkCalendarDaysFree",
        functionName: "checkCalendarDaysFree",
        nameKey: "aiToolsPage.examplesData.checkCalendarDaysFree.name",
        descriptionKey:
            "aiToolsPage.examplesData.checkCalendarDaysFree.description",
        isHttpRequest: false,
        httpMethod: null,
        url: null,
        bodyFields: [],
        responseSchema: '"MONDAY, SATURDAY"',
        ralphRefHandlerKey: null,
    },
    {
        id: "register_scheduling",
        categoryId: "scheduling",
        handlerKey: "mocked:registerScheduling",
        functionName: "registerScheduling",
        nameKey: "aiToolsPage.examplesData.registerScheduling.name",
        descriptionKey:
            "aiToolsPage.examplesData.registerScheduling.description",
        isHttpRequest: false,
        httpMethod: null,
        url: null,
        bodyFields: [
            {
                name: "customerId",
                type: "uuid",
                required: true,
            },
            {
                name: "startAt",
                type: "date",
                required: true,
            },
            {
                name: "finishedAt",
                type: "date",
                required: true,
            },
            {
                name: "observation",
                type: "string",
                required: false,
            },
        ],
        responseSchema: "null",
        ralphRefHandlerKey: null,
    },
    {
        id: "generate_payment",
        categoryId: "payments",
        handlerKey: "mocked:generatePayment",
        functionName: "generatePayment",
        nameKey: "aiToolsPage.examplesData.generatePayment.name",
        descriptionKey:
            "aiToolsPage.examplesData.generatePayment.description",
        isHttpRequest: false,
        httpMethod: null,
        url: null,
        bodyFields: [
            {
                name: "customerId",
                type: "uuid",
                required: true,
            },
            {
                name: "customer_info[cpf]",
                type: "string",
                required: true,
                ralphStepPosition: 1,
            },
            {
                name: "customer_info[full_name]",
                type: "string",
                required: true,
                ralphStepPosition: 0,
            },
        ],
        responseSchema: "null",
        ralphRefHandlerKey: "mocked:customer_info",
    },
    {
        id: "get_kanban_customer_column",
        categoryId: "crm",
        handlerKey: "mocked:getKanbanCustomerColumn",
        functionName: "getKanbanCustomerColumn",
        nameKey: "aiToolsPage.examplesData.getKanbanCustomerColumn.name",
        descriptionKey:
            "aiToolsPage.examplesData.getKanbanCustomerColumn.description",
        isHttpRequest: false,
        httpMethod: null,
        url: null,
        bodyFields: [
            {
                name: "customerId",
                type: "uuid",
                required: true,
            },
        ],
        responseSchema: '{"collumnId":"string","ralphLoopId":"string"}',
        ralphRefHandlerKey: null,
    },
    {
        id: "create_customer_notation",
        categoryId: "crm",
        handlerKey: "mocked:createCustomerNotation",
        functionName: "createCustomerNotation",
        nameKey: "aiToolsPage.examplesData.createCustomerNotation.name",
        descriptionKey:
            "aiToolsPage.examplesData.createCustomerNotation.description",
        isHttpRequest: false,
        httpMethod: null,
        url: null,
        bodyFields: [
            {
                name: "customerId",
                type: "uuid",
                required: false,
            },
            {
                name: "details",
                type: "string",
                required: true,
            },
            {
                name: "status",
                type: "string",
                required: true,
            },
            {
                name: "cardId",
                type: "uuid",
                required: false,
            },
        ],
        responseSchema:
            '{"id":"uuid","customerId":"uuid","cardId":"uuid|null","details":"string","status":"POSITIVE|NEGATIVE|NEUTRAL","createdAt":"date"}',
        ralphRefHandlerKey: null,
    },
    {
        id: "get_customer_notations",
        categoryId: "crm",
        handlerKey: "mocked:getCustomerNotations",
        functionName: "getCustomerNotations",
        nameKey: "aiToolsPage.examplesData.getCustomerNotations.name",
        descriptionKey:
            "aiToolsPage.examplesData.getCustomerNotations.description",
        isHttpRequest: false,
        httpMethod: null,
        url: null,
        bodyFields: [
            {
                name: "customerId",
                type: "uuid",
                required: false,
            },
            {
                name: "cardId",
                type: "uuid",
                required: false,
            },
        ],
        responseSchema: '[{"id":"uuid","details":"string","status":"string","createdAt":"date"}]',
        ralphRefHandlerKey: null,
    },
    {
        id: "update_customer_notation",
        categoryId: "crm",
        handlerKey: "mocked:updateCustomerNotation",
        functionName: "updateCustomerNotation",
        nameKey: "aiToolsPage.examplesData.updateCustomerNotation.name",
        descriptionKey:
            "aiToolsPage.examplesData.updateCustomerNotation.description",
        isHttpRequest: false,
        httpMethod: null,
        url: null,
        bodyFields: [
            {
                name: "notationId",
                type: "uuid",
                required: true,
            },
            {
                name: "details",
                type: "string",
                required: false,
            },
            {
                name: "status",
                type: "string",
                required: false,
            },
            {
                name: "cardId",
                type: "uuid",
                required: false,
            },
        ],
        responseSchema:
            '{"id":"uuid","details":"string","status":"string","updatedAt":"date"}',
        ralphRefHandlerKey: null,
    },
    {
        id: "delete_customer_notation",
        categoryId: "crm",
        handlerKey: "mocked:deleteCustomerNotation",
        functionName: "deleteCustomerNotation",
        nameKey: "aiToolsPage.examplesData.deleteCustomerNotation.name",
        descriptionKey:
            "aiToolsPage.examplesData.deleteCustomerNotation.description",
        isHttpRequest: false,
        httpMethod: null,
        url: null,
        bodyFields: [
            {
                name: "notationId",
                type: "uuid",
                required: true,
            },
        ],
        responseSchema: '{"success":true,"id":"uuid"}',
        ralphRefHandlerKey: null,
    },
];

export function getMockedAiToolCatalogByCategory(
    categoryId: IMockedAiToolCategoryId | "all",
): IMockedAiToolCatalogItem[] {
    if (categoryId === "all") {
        return MOCKED_AI_TOOL_CATALOG;
    }
    return MOCKED_AI_TOOL_CATALOG.filter(
        (item) => item.categoryId === categoryId,
    );
}
