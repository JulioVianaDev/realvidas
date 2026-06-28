import { IAiRalphStepValueType } from "../entities/ai-ralph.entity-type";
import { IAiRalphStepCheck } from "../validators/ralph-step-check.types";

export type IMockedAiRalphCategoryId = "customer" | "scheduling";

export interface IMockedAiRalphCategory {
    id: IMockedAiRalphCategoryId;
    /** i18n key for the category label */
    nameKey: string;
    descriptionKey: string;
}

export interface IMockedAiRalphCatalogStep {
    position: number;
    /** i18n key for the step description shown to the AI */
    descriptionKey: string;
    name: string;
    type: IAiRalphStepValueType;
    checks: IAiRalphStepCheck[];
    isObrigatory: boolean;
}

export interface IMockedAiRalphCatalogItem {
    /** Stable slug used in the public catalog (not a database id) */
    id: string;
    categoryId: IMockedAiRalphCategoryId;
    handlerKey: string;
    name: string;
    /** i18n key for the checklist description */
    descriptionKey: string;
    reutilizable: boolean;
    steps: IMockedAiRalphCatalogStep[];
}

export const MOCKED_AI_RALPH_CATEGORIES: IMockedAiRalphCategory[] = [
    {
        id: "customer",
        nameKey: "aiRalphsPage.catalog.categories.customer",
        descriptionKey: "aiRalphsPage.catalog.categories.customerDescription",
    },
    {
        id: "scheduling",
        nameKey: "aiRalphsPage.catalog.categories.scheduling",
        descriptionKey:
            "aiRalphsPage.catalog.categories.schedulingDescription",
    },
];

export const MOCKED_AI_RALPH_CATALOG: IMockedAiRalphCatalogItem[] = [
    {
        id: "customer_info",
        categoryId: "customer",
        handlerKey: "mocked:customer_info",
        name: "customer_info",
        descriptionKey:
            "aiRalphsPage.seedExamples.customerInfo.description",
        reutilizable: true,
        steps: [
            {
                position: 0,
                descriptionKey:
                    "aiRalphsPage.seedExamples.customerInfo.step0",
                name: "full_name",
                type: "string",
                checks: [{ type: "min", value: 2 }],
                isObrigatory: true,
            },
            {
                position: 1,
                descriptionKey:
                    "aiRalphsPage.seedExamples.customerInfo.step1",
                name: "cpf",
                type: "cpf",
                checks: [{ type: "mask", value: "000.000.000-00" }],
                isObrigatory: false,
            },
        ],
    },
    {
        id: "scheduling_info",
        categoryId: "scheduling",
        handlerKey: "mocked:scheduling_info",
        name: "scheduling_info",
        descriptionKey:
            "aiRalphsPage.seedExamples.schedulingInfo.description",
        reutilizable: false,
        steps: [
            {
                position: 0,
                descriptionKey:
                    "aiRalphsPage.seedExamples.schedulingInfo.step0",
                name: "service_name",
                type: "string",
                checks: [],
                isObrigatory: true,
            },
            {
                position: 1,
                descriptionKey:
                    "aiRalphsPage.seedExamples.schedulingInfo.step1",
                name: "start_date",
                type: "date",
                checks: [],
                isObrigatory: true,
            },
            {
                position: 2,
                descriptionKey:
                    "aiRalphsPage.seedExamples.schedulingInfo.step2",
                name: "notes",
                type: "string",
                checks: [],
                isObrigatory: false,
            },
        ],
    },
];

export function getMockedAiRalphCatalogByCategory(
    categoryId: IMockedAiRalphCategoryId | "all",
): IMockedAiRalphCatalogItem[] {
    if (categoryId === "all") {
        return MOCKED_AI_RALPH_CATALOG;
    }
    return MOCKED_AI_RALPH_CATALOG.filter(
        (item) => item.categoryId === categoryId,
    );
}
