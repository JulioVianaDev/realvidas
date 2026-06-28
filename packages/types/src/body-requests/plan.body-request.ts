export interface IPostCreatePlanBodyRequest {
    name: string;
    displayName: string;
    description?: string;
    priceMonthly: number; // Em centavos
    priceYearly?: number; // Em centavos
    currency?: string;
    maxCalendars: number;
    maxUsers: number;
    maxAiAgents: number;
    maxSocialNetworks: number;
    creditsPerMonth: number;
    storageGb: number;
    isUnlimited?: boolean;
    isCustom?: boolean;
}

export interface IPutUpdatePlanBodyRequest {
    displayName?: string;
    description?: string;
    priceMonthly?: number;
    priceYearly?: number;
    maxCalendars?: number;
    maxUsers?: number;
    maxAiAgents?: number;
    maxSocialNetworks?: number;
    creditsPerMonth?: number;
    storageGb?: number;
    isActive?: boolean;
    isUnlimited?: boolean;
}

