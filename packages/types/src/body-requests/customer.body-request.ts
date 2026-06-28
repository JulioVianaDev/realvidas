export interface IPostCreateCustomerBodyRequest {
  enterpriseId: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  country?: string | null;
}

export interface IPutUpdateCustomerBodyRequest {
  name?: string;
  phone?: string;
  email?: string;
  country?: string;
}
