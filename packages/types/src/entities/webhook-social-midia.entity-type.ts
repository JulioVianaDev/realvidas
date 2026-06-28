import type { ISocialMidiaEntity } from './social-midia.entity-type';

/** Result of resolving Meow `instance` / `device_id` to a tenant row (webhook worker has no CLS). */
export interface IWebhookSocialMidiaResolutionEntity {
  tenantId: string;
  socialMidia: ISocialMidiaEntity;
}
