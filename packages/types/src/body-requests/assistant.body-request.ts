import { IAiService } from "../entities/assistant.entity-type";

export interface IPostCreateAssistantBodyRequest {
    /** Enterprise in the current tenant DB to link this assistant to (pivot). */
    enterpriseId: string;
    name: string;
    description?: string;
    aiService: IAiService;
    model: string;
    pictureUrl?: string;
    isActive?: boolean;
}

export interface IPutUpdateAssistantBodyRequest {
    name?: string;
    description?: string;
    aiService?: IAiService;
    model?: string;
    pictureUrl?: string;
    isActive?: boolean;
}
