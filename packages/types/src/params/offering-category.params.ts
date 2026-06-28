export interface IGetAllOfferingCategoriesParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    active?: boolean;
}

export interface IGetOfferingCategoryByIdParams {
    id: string;
}

export interface IOfferingCategoryEnterpriseQueryParams {
    enterpriseId: string;
}
