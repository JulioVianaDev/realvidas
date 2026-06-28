import {
    IEmployeeGoogleEmailEntity,
    IEmployeeGoogleEmailWithMember,
} from "../entities/employee-google-email.entity-type";

export type IGetEmployeeGoogleEmailsResponse = IEmployeeGoogleEmailEntity[];

export type IGetEmployeeGoogleEmailByIdResponse = IEmployeeGoogleEmailWithMember | null;

export type IAddEmployeeGoogleEmailResponse = IEmployeeGoogleEmailEntity;

export type IUpdateEmployeeGoogleEmailResponse = IEmployeeGoogleEmailEntity;

export interface IDeleteEmployeeGoogleEmailResponse {
    success: boolean;
    id: string;
}

export interface IAuthorizeEmployeeEmailResponse {
    authUrl: string;
    state: string;
}

