export type CreditTransactionType =
  | 'AI_USAGE'
  | 'PLAN_ALLOCATION'
  | 'MANUAL_ADJUSTMENT'
  | 'CREDIT_RECHARGE'
  | 'REFUND';

export type CreditTransactionDirection = 'DEBIT' | 'INCREMENT';

/**
 * One row per tenant schema — shared credit pool for all enterprises in the tenant.
 */
export interface ICreditBalanceEntity {
  id: string;
  balance: number;
  totalConsumed: number;
  totalAdded: number;
  periodStart: string;
  periodEnd: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tracks every credit movement.
 * `enterpriseId` records which enterprise triggered the consumption (for reporting),
 * but the balance itself belongs to the tenant.
 */
export interface ICreditTransactionEntity {
  id: string;
  enterpriseId: string | null;
  direction: CreditTransactionDirection;
  type: CreditTransactionType;
  amount: number;
  balanceAfter: number;
  description: string | null;
  referenceId: string | null;
  referenceType: string | null;
  createdAt: Date;
}
