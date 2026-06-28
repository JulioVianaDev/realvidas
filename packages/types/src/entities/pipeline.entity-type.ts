export type PipelineUsageModule =
  | 'CRM'
  | 'SUPPORT'
  | 'SALES'
  | 'RECRUITMENT'
  | 'PROJECT'
  | 'CUSTOM';

export type PipelineColumnColor =
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'red'
  | 'teal'
  | 'pink'
  | 'yellow'
  | 'none';

export type PipelineCardLabel = 'success' | 'warning' | 'info';

export interface IPipelineEntity {
  id: string;
  enterpriseId: string;
  name: string;
  description: string | null;
  usageModule: PipelineUsageModule;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IPipelineColumnEntity {
  id: string;
  pipelineId: string;
  enterpriseId: string;
  title: string;
  description: string | null;
  color: PipelineColumnColor;
  rank: string;
  isStart: boolean;
  isFinish: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IPipelineCardEntity {
  id: string;
  columnId: string;
  enterpriseId: string;
  title: string;
  description: string | null;
  label: PipelineCardLabel | null;
  rank: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
