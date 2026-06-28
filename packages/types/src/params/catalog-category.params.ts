export interface IGetAllCatalogCategoriesParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    active?: boolean;
}

export interface IGetCatalogCategoryByIdParams {
    id: string;
}

export interface ICatalogCategoryEnterpriseQueryParams {
    enterpriseId: string;
}
