export interface IGetAllCombosParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    active?: boolean;
}

export interface IGetComboByIdParams {
    id: string;
}

export interface IComboEnterpriseQueryParams {
    enterpriseId: string;
}
