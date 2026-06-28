export const ADMIN_COMPLIMENTARY_PLAN_NAME = 'admin-complimentary';

/** Internal SaaS-owner grant plan — created on demand if missing (no seed required). */
export const adminComplimentaryPlanSeed = {
  name: ADMIN_COMPLIMENTARY_PLAN_NAME,
  displayName: 'Admin Complimentary',
  description: 'Internal SaaS owner grant — not sold publicly',
  priceMonthly: 0,
  priceYearly: 0,
  currency: 'BRL',
  maxCalendars: 10,
  maxUsers: 15,
  maxAiAgents: 7,
  maxSocialNetworks: 10,
  creditsPerMonth: 10000,
  storageGb: 40,
  isUnlimited: false,
  isActive: true,
  isCustom: true,
} as const;

/** Keep in sync with `apps/frontend/src/data/plans-public-fallback.ts` (public landing fallback). */
export const plansSeeded = [
  {
    name: 'business',
    displayName: 'Business',
    description:
      'Best for established businesses with multiple users',
    priceMonthly: 89700, // R$ 997.00
    priceYearly: 1068000, // R$ 10680.00 (discount ~11%)
    currency: 'BRL',
    maxCalendars: 10,
    maxUsers: 15,
    maxAiAgents: 7,
    maxSocialNetworks: 10,
    creditsPerMonth: 10000,
    storageGb: 40,
    isUnlimited: false,
    isActive: true,
    isCustom: false,
  },
  {
    name: 'starter',
    displayName: 'Starter',
    description: 'Perfect for solo professionals getting started',
    priceMonthly: 28700, // R$ 287.00
    priceYearly: 320000, // R$ 3200.00 (discount ~12%)
    currency: 'BRL',
    maxCalendars: 1,
    maxUsers: 1,
    maxAiAgents: 1,
    maxSocialNetworks: 1,
    creditsPerMonth: 2500,
    storageGb: 5,
    isUnlimited: false,
    isActive: true,
    isCustom: false,
  },
  {
    name: 'professional',
    displayName: 'Professional',
    description: 'Ideal for small teams and growing businesses',
    priceMonthly: 48700, // R$ 487.00
    priceYearly: 520000, // R$ 5200.00 (discount ~11%)
    currency: 'BRL',
    maxCalendars: 5,
    maxUsers: 5,
    maxAiAgents: 3,
    maxSocialNetworks: 4,
    creditsPerMonth: 6000,
    storageGb: 10,
    isUnlimited: false,
    isActive: true,
    isCustom: false,
  },
  adminComplimentaryPlanSeed,
];
