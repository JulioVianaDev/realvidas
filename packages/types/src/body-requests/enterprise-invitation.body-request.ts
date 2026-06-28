import { EnterpriseRoleType } from "../entities/enterprise-member.entity-type";

export interface ICreateEnterpriseInvitationBodyRequest {
    email: string;
    role: EnterpriseRoleType;
}

export interface IAcceptInvitationBodyRequest {
    token: string;
}

export interface IDeclineInvitationBodyRequest {
    token: string;
}
