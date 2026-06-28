import { IAiToolKind } from "../entities/ai-tool.entity-type";
import type { IAiToolModuleId } from "../catalog/ai-tool-module.catalog";

export interface IGetAllAiToolsParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    kind?: IAiToolKind;
    module?: IAiToolModuleId;
    isActive?: boolean;
}

export interface IGetAiToolByIdParams {
    id: string;
}

export interface IAiToolEnterpriseQueryParams {
    enterpriseId: string;
}
