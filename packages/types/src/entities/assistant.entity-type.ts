export interface IAssistantEntity {
    id: string;
    enterpriseId: string | null;
    name: string;
    description: string | null;
    aiService: IAiService;
    model: string;
    pictureUrl: string | null;
    isActive: boolean;
    creditsCost: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type IAiService =
    | "CHAT_GPT"
    | "GEMINI"
    | "CLAUDE"
    | "DEEPSEEK"
    | "OTHER_ENTERPRISE";
