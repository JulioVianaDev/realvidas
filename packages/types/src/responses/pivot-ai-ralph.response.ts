import { IPivotAiRalphEntity } from "../entities/pivot-ai-ralph.entity-type";

export type IGetAllPivotAiRalphsResponse = IPivotAiRalphEntity[];

export type IGetPivotAiRalphByIdResponse = IPivotAiRalphEntity | null;

export type IPostCreatePivotAiRalphResponse = IPivotAiRalphEntity;

export type IPutUpdatePivotAiRalphResponse = IPivotAiRalphEntity;

export interface IDeletePivotAiRalphResponse {
    success: boolean;
    id: string;
}
