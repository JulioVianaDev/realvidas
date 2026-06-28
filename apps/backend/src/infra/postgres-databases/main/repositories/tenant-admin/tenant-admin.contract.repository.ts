export type TenantOption = {
  id: string;
  createdAt: Date;
  createdByUserId: string;
  createdByUserName: string | null;
};

export type EnterpriseOption = {
  id: string;
  name: string;
};

export abstract class ITenantAdminContractRepository {
  abstract listTenants(): Promise<TenantOption[]>;

  abstract userHasTenantAccess(
    userId: string,
    tenantId: string,
  ): Promise<boolean>;

  abstract listEnterprisesByTenant(
    tenantId: string,
  ): Promise<EnterpriseOption[]>;
}
