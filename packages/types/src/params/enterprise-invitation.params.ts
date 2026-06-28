import { InvitationStatusType } from "../entities/enterprise-invitation.entity-type";

export interface IGetEnterpriseInvitationsParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    status?: InvitationStatusType | "ALL";
    email?: string;
}

export interface IGetInvitationByTokenParams {
    token: string;
}

export interface IGetMyPendingInvitationsParams {
    email: string;
}
