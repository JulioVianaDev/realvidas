import { IPivotAiToolEntity } from "../entities/pivot-ai-tool.entity-type";

export type IGetAllPivotAiToolsResponse = IPivotAiToolEntity[];

export type IGetPivotAiToolByIdResponse = IPivotAiToolEntity | null;

export type IPostCreatePivotAiToolResponse = IPivotAiToolEntity;

export type IPutUpdatePivotAiToolResponse = IPivotAiToolEntity;

export type IPutSyncPivotAiToolsResponse = IGetAllPivotAiToolsResponse;

export interface IDeletePivotAiToolResponse {
    success: boolean;
    id: string;
}
