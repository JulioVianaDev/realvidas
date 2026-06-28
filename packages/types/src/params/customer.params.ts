export interface IGetAllCustomersParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export interface IGetCustomerByIdParams {
    id: string;
}
