import { Paginate } from "../helpers/paginate";
import { IAiToolEntity } from "../entities/ai-tool.entity-type";

export type IGetAllAiToolsResponse = Paginate<IAiToolEntity>;

export type IGetAiToolByIdResponse = IAiToolEntity | null;

export type IPostCreateAiToolResponse = IAiToolEntity;

export type IPutUpdateAiToolResponse = IAiToolEntity;

export interface IDeleteAiToolResponse {
    success: boolean;
    id: string;
}
