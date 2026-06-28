import { Paginate } from "../helpers/paginate";
import {
    IEnterpriseEntity,
    IEnterpriseWithOwner,
    IEnterpriseWithMembersCount,
} from "../entities/enterprise.entity-type";

export type IGetEnterprisesResponse = Paginate<IEnterpriseWithMembersCount>;

export type IGetEnterpriseByIdResponse = IEnterpriseWithOwner | null;

export type IGetMyEnterprisesResponse = Paginate<IEnterpriseWithMembersCount>;

export type ICreateEnterpriseResponse = IEnterpriseWithOwner;

export type IUpdateEnterpriseResponse = IEnterpriseEntity;

export interface IDeleteEnterpriseResponse {
    success: boolean;
    id: string;
}

export interface ITransferOwnershipResponse {
    success: boolean;
    enterprise: IEnterpriseEntity;
    oldOwnerId: string;
    newOwnerId: string;
}

export interface IGoogleAuthUrlResponse {
    authUrl: string;
    state: string;
}

export interface IGoogleAuthCallbackResponse {
    success: boolean;
    message: string;
    enterprise: IEnterpriseEntity;
}

