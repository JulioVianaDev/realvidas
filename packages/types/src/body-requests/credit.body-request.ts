import {
  CreditTransactionType,
} from '../entities/credit.entity-type';

export interface IPostCreditDebitBodyRequest {
  amount: number;
  type: CreditTransactionType;
  enterpriseId?: string;
  description?: string;
  referenceId?: string;
  referenceType?: string;
}

export interface IPostCreditIncrementBodyRequest {
  amount: number;
  type: CreditTransactionType;
  enterpriseId?: string;
  description?: string;
  referenceId?: string;
  referenceType?: string;
}

export interface IPostCreditManualAdjustmentBodyRequest {
  amount: number;
  enterpriseId?: string;
  description?: string;
}
