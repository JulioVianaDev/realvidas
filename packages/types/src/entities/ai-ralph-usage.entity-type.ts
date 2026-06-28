export interface IAiRalphUsageEntity {
    id: string;
    enterpriseId: string;
    aiId: string;
    ralphId: string;
    conversationId: string;
    stoppedAtStepUuid: string | null;
    stoppedAtStepPosition: number | null;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
