export interface IPlanEntity {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
    priceMonthly: number; // Em centavos
    priceYearly?: number
    currency: string;
    maxCalendars: number;
    maxUsers: number;
    maxAiAgents: number;
    maxSocialNetworks: number;
    creditsPerMonth: number;
    storageGb: number;
    isUnlimited: boolean;
    isActive: boolean;
    isCustom: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type PlanName = "starter" | "professional" | "business" | "custom";

