import { Paginate } from "../helpers/paginate";
import {
    IEnterpriseInvitationEntity,
    IEnterpriseInvitationWithRelations,
} from "../entities/enterprise-invitation.entity-type";

export type IGetEnterpriseInvitationsResponse = Paginate<IEnterpriseInvitationWithRelations>;

export type IGetInvitationByTokenResponse = IEnterpriseInvitationWithRelations | null;

export type ICreateEnterpriseInvitationResponse = IEnterpriseInvitationEntity;

export interface IAcceptInvitationResponse {
    success: boolean;
    message: string;
    memberId: string;
    enterpriseId: string;
}

export interface IDeclineInvitationResponse {
    success: boolean;
    message: string;
}

export interface ICancelInvitationResponse {
    success: boolean;
    id: string;
}

export type IGetMyPendingInvitationsResponse = IEnterpriseInvitationWithRelations[];

