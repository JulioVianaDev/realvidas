export interface IGetAllPlansParams {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
    currency?: string;
}

export interface IGetActivePlansParams {
    currency?: string;
}

export interface IGetPlanByIdParams {
    id: string;
}

export interface IGetPlanByNameParams {
    name: string;
}

