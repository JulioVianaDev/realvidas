import { PipelineUsageModule } from '../entities/pipeline.entity-type';

export interface IGetAllPipelinesParams {
  enterpriseId: string;
  usageModule?: PipelineUsageModule;
  page?: number;
  pageSize?: number;
}

export interface IGetAllPipelineColumnsParams {
  enterpriseId: string;
  pipelineId: string;
}

export interface IGetAllPipelineCardsParams {
  enterpriseId: string;
  columnId: string;
  page?: number;
  pageSize?: number;
}
