export interface IGetAllProductsParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    categoryId?: string;
    active?: boolean;
    featured?: boolean;
}

export interface IGetProductByIdParams {
    id: string;
}

export interface IProductEnterpriseQueryParams {
    enterpriseId: string;
}
