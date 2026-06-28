/**
 * Enums used by tenant entities - mapped from Prisma schema
 */
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
}

export enum EnterpriseRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  SELLER = 'SELLER',
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum TrialStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
}

export enum EnterprisePaymentStatus {
  NOT_PAID = 'NOT_PAID',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
}

export enum PlanType {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM',
}

export enum EntityPhone {
  ENTERPRISE = 'ENTERPRISE',
  USER = 'USER',
  CLIENT = 'CLIENT',
}

export enum AiService {
  CHAT_GPT = 'CHAT_GPT',
  GEMINI = 'GEMINI',
  CLAUDE = 'CLAUDE',
  DEEPSEEK = 'DEEPSEEK',
  OTHER_ENTERPRISE = 'OTHER_ENTERPRISE',
}

/** Tenant `social_midias.type` — extend when adding new channels. */
export enum SocialMediaType {
  WHATSAPP_realvidas = 'WHATSAPP_realvidas',
}

/** Channel / platform through which we can reach a customer. */
export enum ContactChannel {
  WHATSAPP = 'WHATSAPP',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  TELEGRAM = 'TELEGRAM',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export enum CalendarPermission {
  READ = 'READ',
  WRITE = 'WRITE',
  OWNER = 'OWNER',
}

export enum EventStatus {
  CONFIRMED = 'CONFIRMED',
  TENTATIVE = 'TENTATIVE',
  CANCELLED = 'CANCELLED',
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  PAUSED = 'PAUSED',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_SLIP = 'BANK_SLIP',
  DEBIT_CARD = 'DEBIT_CARD',
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  OPENPIX = 'OPENPIX',
  ASAAS = 'ASAAS',
  NONE = 'NONE',
}

export enum UserTenantRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

/** Who handles the thread: automation vs human agent. */
export enum ConversationLifecycleMode {
  AI = 'AI',
  HUMAN = 'HUMAN',
}

export enum ConversationStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum ConversationMessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  AGENT = 'AGENT',
  SYSTEM = 'SYSTEM',
}
