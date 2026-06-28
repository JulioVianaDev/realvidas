export interface ITrialEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    enterpriseId: string;
    userId: string;
    tokensUsed: number;
    totalScheduling: number;
    tokensAvailable: number;
    status: ITrialStatus;
    expiresAt: Date;
}

export type ITrialStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";