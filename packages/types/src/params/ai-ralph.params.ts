import { IAiRalphKind } from "../entities/ai-ralph.entity-type";

export interface IGetAllAiRalphsParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    kind?: IAiRalphKind;
    isActive?: boolean;
    /** When true (default), returns only the latest version per handlerKey. */
    latestOnly?: boolean;
}

export interface IGetAiRalphByIdParams {
    id: string;
}

export interface IAiRalphEnterpriseQueryParams {
    enterpriseId: string;
}
