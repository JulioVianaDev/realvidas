import type { IAiRalphStepCheck } from "../validators/ralph-step-check.types";
import type { IAiToolModuleId } from "../catalog/ai-tool-module.catalog";

export type IAiToolKind = "MOCKED" | "CUSTOM";

export type IAiToolHttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type IAiToolFieldType =
    | "string"
    | "number"
    | "boolean"
    | "uuid"
    | "date"
    | "cpf"
    | "phone"
    | "email";

export type IAiToolResponseSchemaSource = "MANUAL" | "TOOL" | "CHECKLIST";

export type IAiToolResponseSchemaFormat = "builder" | "example";

export type IAiToolFieldValueSource =
    | "MANUAL"
    | "CHECKLIST"
    | "TOOL_INPUT"
    | "TOOL_RESPONSE";

export interface IAiToolResponseSchemaRef {
    source: IAiToolResponseSchemaSource;
    /** How manual responseSchema is authored when source=MANUAL. */
    format?: IAiToolResponseSchemaFormat;
    /** `handlerKey` of the source tool when source=TOOL. */
    toolHandlerKey?: string | null;
    /** `handlerKey` of the source checklist when source=CHECKLIST. */
    checklistHandlerKey?: string | null;
}

export interface IAiToolBodyField {
    id: string;
    name: string;
    type: IAiToolFieldType;
    required: boolean;
    /** Where the field value is resolved from at runtime. */
    valueSource?: IAiToolFieldValueSource;
    /** Checklist linked to this field when valueSource=CHECKLIST. */
    ralphRefId: string | null;
    /** Binds the field to a specific ralph step uuid when valueSource=CHECKLIST. */
    ralphStepUuid: string | null;
    /** Source tool handlerKey when valueSource=TOOL_INPUT or TOOL_RESPONSE. */
    sourceToolHandlerKey?: string | null;
    /** Body field name on the source tool when valueSource=TOOL_INPUT. */
    sourceToolFieldName?: string | null;
    /** Response JSON key on the source tool when valueSource=TOOL_RESPONSE. */
    sourceToolResponseKey?: string | null;
    /** Manual validation checks when valueSource=MANUAL. */
    checks?: IAiRalphStepCheck[];
}

export interface IAiToolEntity {
    id: string;
    enterpriseId: string;
    kind: IAiToolKind;
    /** Internal dispatch key (mocked:… / custom:…). Immutable after create. */
    handlerKey: string;
    /** Human-readable label shown in the UI. */
    name: string;
    /** camelCase name sent to the AI provider for function calling. Immutable after create. */
    functionName: string;
    description: string;
    /** System module (calendar, payments, crm, …) — groups tools in UI. */
    module: IAiToolModuleId;
    /** When false the tool runs internal logic instead of calling an external HTTP API. */
    isHttpRequest: boolean;
    httpMethod: IAiToolHttpMethod | null;
    url: string | null;
    bodyFields: IAiToolBodyField[];
    responseSchema: string;
    responseSchemaRef: IAiToolResponseSchemaRef | null;
    ralphRefId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
