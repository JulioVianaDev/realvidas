export interface IPostCreatePivotAiRalphBodyRequest {
    enterpriseId: string;
    assistantId: string;
    aiRalphId: string;
    enabled?: boolean;
}

export interface IPutUpdatePivotAiRalphBodyRequest {
    enabled: boolean;
}
