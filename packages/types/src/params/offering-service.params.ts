export interface IGetAllOfferingServicesParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    categoryId?: string;
    active?: boolean;
    featured?: boolean;
}

export interface IGetOfferingServiceByIdParams {
    id: string;
}

export interface IOfferingServiceEnterpriseQueryParams {
    enterpriseId: string;
}
