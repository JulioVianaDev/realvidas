import { IPlanEntity } from "@global-types/entities/plan.entity-type";

/**
 * Mirrors `apps/backend/src/modules/seed/data/plans.seed.ts` for the public
 * landing when the plans API returns nothing or fails. Update both together.
 */
const FALLBACK_TS = "2020-01-01T00:00:00.000Z";

function row(
    idSuffix: string,
    row: Omit<
        IPlanEntity,
        "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
): IPlanEntity {
    return {
        ...row,
        id: `fallback-plan-${idSuffix}`,
        createdAt: new Date(FALLBACK_TS),
        updatedAt: new Date(FALLBACK_TS),
        deletedAt: null,
    };
}

export const PUBLIC_PLANS_FALLBACK: IPlanEntity[] = [
    row("business", {
        name: "business",
        displayName: "Business",
        description:
            "Best for established businesses with multiple users",
        priceMonthly: 89700,
        priceYearly: 1068000,
        currency: "BRL",
        maxCalendars: 10,
        maxUsers: 15,
        maxAiAgents: 7,
        maxSocialNetworks: 10,
        creditsPerMonth: 10000,
        storageGb: 40,
        isUnlimited: false,
        isActive: true,
        isCustom: false,
    }),
    row("starter", {
        name: "starter",
        displayName: "Starter",
        description: "Perfect for solo professionals getting started",
        priceMonthly: 28700,
        priceYearly: 320000,
        currency: "BRL",
        maxCalendars: 1,
        maxUsers: 1,
        maxAiAgents: 1,
        maxSocialNetworks: 1,
        creditsPerMonth: 2500,
        storageGb: 5,
        isUnlimited: false,
        isActive: true,
        isCustom: false,
    }),
    row("professional", {
        name: "professional",
        displayName: "Professional",
        description: "Ideal for small teams and growing businesses",
        priceMonthly: 48700,
        priceYearly: 520000,
        currency: "BRL",
        maxCalendars: 5,
        maxUsers: 5,
        maxAiAgents: 3,
        maxSocialNetworks: 4,
        creditsPerMonth: 6000,
        storageGb: 10,
        isUnlimited: false,
        isActive: true,
        isCustom: false,
    }),
    row("custom", {
        name: "custom",
        displayName: "Custom",
        description: "Tailored solutions for large enterprises",
        priceMonthly: 999900,
        currency: "BRL",
        maxCalendars: 999,
        maxUsers: 999,
        maxAiAgents: 999,
        maxSocialNetworks: 999,
        creditsPerMonth: 999999,
        storageGb: 999,
        isUnlimited: true,
        isActive: true,
        isCustom: true,
    }),
];
