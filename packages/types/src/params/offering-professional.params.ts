export interface IGetAllOfferingProfessionalsParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    active?: boolean;
}

export interface IGetOfferingProfessionalByIdParams {
    id: string;
}

export interface IOfferingProfessionalEnterpriseQueryParams {
    enterpriseId: string;
}
