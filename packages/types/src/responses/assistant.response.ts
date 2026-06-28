import { Paginate } from "../helpers/paginate";
import { IAssistantEntity } from "../entities/assistant.entity-type";

export type IGetAllAssistantsResponse = Paginate<IAssistantEntity>;

export type IGetAssistantByIdResponse = IAssistantEntity | null;

export type IPostCreateAssistantResponse = IAssistantEntity;

export type IPutUpdateAssistantResponse = IAssistantEntity;

export interface IDeleteAssistantResponse {
    success: boolean;
    id: string;
}

