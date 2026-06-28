/**
 * Webhook worker: upsert customer by channel + external id (no HTTP tenant context).
 */
export interface IFindOrCreateWebhookCustomerBodyRequest {
    /** `public.tenants.id` — which tenant schema to open (webhook has no CLS). */
    tenantId: string;
    enterpriseId: string;
    socialMidiaId: number;
    externalId: string;
    lid: string | null;
    name: string | null;
}
