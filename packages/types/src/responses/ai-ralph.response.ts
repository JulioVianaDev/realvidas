import { Paginate } from "../helpers/paginate";
import { IAiRalphEntity } from "../entities/ai-ralph.entity-type";

export type IGetAllAiRalphsResponse = Paginate<IAiRalphEntity>;

export type IGetAiRalphByIdResponse = IAiRalphEntity | null;

export type IPostCreateAiRalphResponse = IAiRalphEntity;

export type IPostCreateAiRalphVersionResponse = IAiRalphEntity;

export interface IDeleteAiRalphResponse {
    success: boolean;
    id: string;
}
