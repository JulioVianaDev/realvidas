import {
  IPipelineEntity,
  IPipelineColumnEntity,
  IPipelineCardEntity,
} from '../entities/pipeline.entity-type';

// ── Pipeline ──

export interface IGetAllPipelinesResponse {
  data: IPipelineEntity[];
  metadata: {
    page: number;
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    lastPage: number;
  };
}

export type IGetPipelineByIdResponse = IPipelineEntity | null;

export type IPostCreatePipelineResponse = IPipelineEntity;

export type IPutUpdatePipelineResponse = IPipelineEntity;

export interface IDeletePipelineResponse {
  success: boolean;
  id: string;
}

// ── Pipeline Column ──

export type IGetAllPipelineColumnsResponse = IPipelineColumnEntity[];

export type IPostCreatePipelineColumnResponse = IPipelineColumnEntity;

export type IPutUpdatePipelineColumnResponse = IPipelineColumnEntity;

export interface IDeletePipelineColumnResponse {
  success: boolean;
  id: string;
}

// ── Pipeline Card ──

export interface IGetAllPipelineCardsResponse {
  data: IPipelineCardEntity[];
  metadata: {
    page: number;
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    lastPage: number;
  };
}

export type IPostCreatePipelineCardResponse = IPipelineCardEntity;

export type IPutUpdatePipelineCardResponse = IPipelineCardEntity;

export interface IDeletePipelineCardResponse {
  success: boolean;
  id: string;
}

export type IPostMovePipelineCardResponse = IPipelineCardEntity;
