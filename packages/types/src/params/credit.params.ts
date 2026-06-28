import {
  CreditTransactionDirection,
  CreditTransactionType,
} from '../entities/credit.entity-type';

export interface IGetCreditBalanceParams {}

export interface IGetAllCreditTransactionsParams {
  page?: number;
  pageSize?: number;
  enterpriseId?: string;
  direction?: CreditTransactionDirection;
  type?: CreditTransactionType;
  startDate?: string;
  endDate?: string;
}
