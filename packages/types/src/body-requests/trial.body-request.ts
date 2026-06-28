export interface IPostTrialBodyRequest {
    enterpriseId: string;
}

export interface IPutTrialBodyRequest {
    tokensUsed?: number;
    totalScheduling?: number;
    tokensAvailable?: number;
    status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
}

