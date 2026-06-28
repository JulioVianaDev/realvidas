import { ITrialStatus } from "../entities/trial.entity-type";

export interface IGetTrialsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    enterpriseId?: string;
    userId?: string;
    status?: ITrialStatus;
}

export interface IGetTrialByIdParams {
    id: string;
}

export interface IGetTrialByEnterpriseAndUserParams {
    enterpriseId: string;
    userId?: string; // Optional now, as it comes from JWT
}
