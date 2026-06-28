import {
    IMockedAiToolCategoryId,
    MOCKED_AI_TOOL_CATEGORIES,
} from "./mocked-ai-tool.catalog";

/** System module / domain a tool belongs to (matches catalog categories + general). */
export type IAiToolModuleId = IMockedAiToolCategoryId | "general";

export interface IAiToolModuleDefinition {
    id: IAiToolModuleId;
    /** i18n key for the module label */
    nameKey: string;
    /** i18n key for the module description */
    descriptionKey: string;
}

export const AI_TOOL_GENERAL_MODULE: IAiToolModuleDefinition = {
    id: "general",
    nameKey: "aiToolsPage.modules.general",
    descriptionKey: "aiToolsPage.modules.generalDescription",
};

/** Ordered list of modules for UI sections (catalog categories first, then general). */
export const AI_TOOL_MODULES: IAiToolModuleDefinition[] = [
    ...MOCKED_AI_TOOL_CATEGORIES,
    AI_TOOL_GENERAL_MODULE,
];

export const AI_TOOL_MODULE_IDS: IAiToolModuleId[] = AI_TOOL_MODULES.map(
    (m) => m.id,
);

export function isAiToolModuleId(value: string): value is IAiToolModuleId {
    return (AI_TOOL_MODULE_IDS as string[]).includes(value);
}

export function getAiToolModuleById(
    id: IAiToolModuleId,
): IAiToolModuleDefinition | undefined {
    return AI_TOOL_MODULES.find((m) => m.id === id);
}
