import { Paginate } from "../helpers/paginate";
import { ITrialEntity } from "../entities/trial.entity-type";

export type IGetTrialsResponse = Paginate<ITrialEntity>;

export type IGetTrialByIdResponse = ITrialEntity | null;

export type IGetTrialByEnterpriseAndUserResponse = ITrialEntity | null;

export type IPostTrialResponse = ITrialEntity;

export type IPutTrialResponse = ITrialEntity;

export interface IDeleteTrialResponse {
    success: boolean;
    id: string;
}

