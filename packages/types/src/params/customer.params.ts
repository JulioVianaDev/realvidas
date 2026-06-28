export interface IGetAllCustomersParams {
  enterpriseId: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface IGetCustomerByIdParams {
  id: string;
}

export interface ICustomerEnterpriseQueryParams {
  enterpriseId: string;
}
