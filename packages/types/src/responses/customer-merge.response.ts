import { ICustomerMergeEntity } from '../entities/customer-merge.entity-type';

export interface IPostMergeCustomersResponse {
  winnerId: string;
  loserId: string;
}

export type IGetMergeHistoryResponse = ICustomerMergeEntity[];
