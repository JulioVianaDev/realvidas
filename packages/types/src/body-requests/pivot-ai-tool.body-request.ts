export interface IPostCreatePivotAiToolBodyRequest {
    enterpriseId: string;
    assistantId: string;
    aiToolId: string;
    enabled?: boolean;
}

export interface IPutUpdatePivotAiToolBodyRequest {
    enabled: boolean;
}

export interface IPutSyncPivotAiToolItem {
    aiToolId: string;
    enabled: boolean;
}

export interface IPutSyncPivotAiToolsBodyRequest {
    enterpriseId: string;
    assistantId: string;
    pivots: IPutSyncPivotAiToolItem[];
}
