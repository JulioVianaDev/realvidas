import { IAiService } from "../entities/assistant.entity-type";

export interface IGetAllAssistantsParams {
    /** Scope listing to assistants linked to this enterprise (tenant schema). */
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    aiService?: IAiService;
    isActive?: boolean;
}

export interface IGetAssistantByIdParams {
    id: string;
}

/** Query string for routes that need enterprise scope (membership checked in service). */
export interface IAssistantEnterpriseQueryParams {
    enterpriseId: string;
}
