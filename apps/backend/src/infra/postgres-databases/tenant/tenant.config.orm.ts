import { DataSourceOptions } from 'typeorm';
import { mainConfig } from '../main/main.config.orm';

/** Used only when running migrations inside a tenant schema (tenant_1, tenant_2, ...). Never run in public. */
export const tenantConfig: DataSourceOptions = {
  ...mainConfig,
  // Tenant entities only. User, Trial, Plan, Subscription, Payment live in main DB.
  entities: [
    __dirname + '/entities/enterprise.entity{.ts,.js}',
    __dirname + '/entities/enterprise-member.entity{.ts,.js}',
    __dirname + '/entities/enterprise-invitation.entity{.ts,.js}',
    __dirname + '/entities/file.entity{.ts,.js}',
    __dirname + '/entities/calendar.entity{.ts,.js}',
    __dirname + '/entities/calendar-share.entity{.ts,.js}',
    __dirname + '/entities/calendar-event.entity{.ts,.js}',
    __dirname + '/entities/assistant.entity{.ts,.js}',
    __dirname + '/entities/social-midia.entity{.ts,.js}',
    __dirname + '/entities/customer.entity{.ts,.js}',
    __dirname + '/entities/contact-identifier.entity{.ts,.js}',
    __dirname + '/entities/conversation.entity{.ts,.js}',
    __dirname + '/entities/conversation-message.entity{.ts,.js}',
    __dirname + '/entities/ai-tool.entity{.ts,.js}',
    __dirname + '/entities/ai-ralph.entity{.ts,.js}',
    __dirname + '/entities/ai-ralph-usage.entity{.ts,.js}',
    __dirname + '/entities/pivot/pivot-ai-tool.entity{.ts,.js}',
    __dirname + '/entities/pivot/pivot-ai-ralph.entity{.ts,.js}',
    __dirname + '/entities/catalog-category.entity{.ts,.js}',
    __dirname + '/entities/product.entity{.ts,.js}',
    __dirname + '/entities/combo.entity{.ts,.js}',
    __dirname + '/entities/order.entity{.ts,.js}',
    __dirname + '/entities/offering-category.entity{.ts,.js}',
    __dirname + '/entities/offering-professional.entity{.ts,.js}',
    __dirname + '/entities/offering-service.entity{.ts,.js}',
    __dirname + '/entities/pipeline.entity{.ts,.js}',
    __dirname + '/entities/pipeline-column.entity{.ts,.js}',
    __dirname + '/entities/pipeline-card.entity{.ts,.js}',
    __dirname + '/entities/customer-notation.entity{.ts,.js}',
    __dirname + '/entities/instance/*.entity{.ts,.js}',
    __dirname + '/entities/payment-provider-account.entity{.ts,.js}',
    __dirname + '/entities/customer-merge.entity{.ts,.js}',
    __dirname + '/entities/campaign.entity{.ts,.js}',
    __dirname + '/entities/campaign-recipient.entity{.ts,.js}',
  ],
  // Only match migration files (timestamp-Name). Two patterns so both .ts (dev) and .js (compiled) are found
  migrations: [
    __dirname + '/migrations/*-*.ts',
    __dirname + '/migrations/*-*.js',
  ],
};
