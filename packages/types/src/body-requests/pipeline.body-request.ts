import {
  PipelineUsageModule,
  PipelineColumnColor,
  PipelineCardLabel,
} from '../entities/pipeline.entity-type';

// ── Pipeline ──

export interface IPostCreatePipelineBodyRequest {
  enterpriseId: string;
  name: string;
  description?: string;
  usageModule: PipelineUsageModule;
}

export interface IPutUpdatePipelineBodyRequest {
  name?: string;
  description?: string;
  usageModule?: PipelineUsageModule;
}

// ── Pipeline Column ──

export interface IPostCreatePipelineColumnBodyRequest {
  enterpriseId: string;
  pipelineId: string;
  title: string;
  description?: string;
  color?: PipelineColumnColor;
  rank: string;
  isStart?: boolean;
  isFinish?: boolean;
}

export interface IPutUpdatePipelineColumnBodyRequest {
  title?: string;
  description?: string;
  color?: PipelineColumnColor;
  rank?: string;
}

// ── Pipeline Card ──

export interface IPostCreatePipelineCardBodyRequest {
  enterpriseId: string;
  columnId: string;
  title: string;
  description?: string;
  label?: PipelineCardLabel;
  rank: string;
  metadata?: Record<string, unknown>;
}

export interface IPutUpdatePipelineCardBodyRequest {
  columnId?: string;
  title?: string;
  description?: string;
  label?: PipelineCardLabel | null;
  rank?: string;
  metadata?: Record<string, unknown>;
}

// ── Pipeline Card Move ──

export interface IPostMovePipelineCardBodyRequest {
  enterpriseId: string;
  columnId: string;
  afterCardId?: string;
  beforeCardId?: string;
}
