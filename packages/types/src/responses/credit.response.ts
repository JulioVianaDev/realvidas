import { Paginate } from '../helpers/paginate';
import {
  ICreditBalanceEntity,
  ICreditTransactionEntity,
} from '../entities/credit.entity-type';

export type IGetCreditBalanceResponse = ICreditBalanceEntity | null;

export type IGetAllCreditTransactionsResponse =
  Paginate<ICreditTransactionEntity>;

export type IPostCreditDebitResponse = ICreditTransactionEntity;

export type IPostCreditIncrementResponse = ICreditTransactionEntity;

export type IPostCreditManualAdjustmentResponse = ICreditTransactionEntity;
