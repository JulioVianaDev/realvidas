import {
    IAiToolBodyField,
    IAiToolHttpMethod,
    IAiToolKind,
    IAiToolResponseSchemaRef,
} from "../entities/ai-tool.entity-type";
import type { IAiToolModuleId } from "../catalog/ai-tool-module.catalog";

export interface IPostCreateAiToolBodyRequest {
    enterpriseId: string;
    kind: IAiToolKind;
    /** Assigned by the backend on create when omitted; immutable afterwards. */
    handlerKey?: string;
    /** Assigned by the backend on create when omitted; immutable afterwards. */
    functionName?: string;
    /** Human-readable label shown in the UI. */
    name: string;
    description: string;
    module?: IAiToolModuleId;
    isHttpRequest?: boolean;
    httpMethod?: IAiToolHttpMethod | null;
    url?: string | null;
    bodyFields: IAiToolBodyField[];
    responseSchema: string;
    responseSchemaRef?: IAiToolResponseSchemaRef | null;
    ralphRefId?: string | null;
    isActive?: boolean;
}

export interface IPutUpdateAiToolBodyRequest {
    kind?: IAiToolKind;
    name?: string;
    description?: string;
    module?: IAiToolModuleId;
    isHttpRequest?: boolean;
    httpMethod?: IAiToolHttpMethod | null;
    url?: string | null;
    bodyFields?: IAiToolBodyField[];
    responseSchema?: string;
    responseSchemaRef?: IAiToolResponseSchemaRef | null;
    ralphRefId?: string | null;
    isActive?: boolean;
}
