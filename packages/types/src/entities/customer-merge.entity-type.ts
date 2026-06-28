export interface ICustomerMergeEntity {
  id: string;
  winnerId: string;
  loserId: string;
  mergedBy: string | null;
  mergedAt: string;
}
