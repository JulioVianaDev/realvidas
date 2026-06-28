export interface IGetEnterprisesParams {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
}

export interface IGetEnterpriseByIdParams {
    id: string;
}

export interface IGetEnterpriseBySlugParams {
    slug: string;
}

export interface IGetMyEnterprisesParams {
    page?: number;
    pageSize?: number;
    includeInactive?: boolean;
}
