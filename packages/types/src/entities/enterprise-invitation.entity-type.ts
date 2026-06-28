// Enterprise Invitation Entity Types

import { EnterpriseRoleType } from "./enterprise-member.entity-type";

export type InvitationStatusType = 
    | "PENDING" 
    | "ACCEPTED" 
    | "DECLINED" 
    | "EXPIRED" 
    | "CANCELLED";

export const InvitationStatusValues: {
    PENDING: "PENDING";
    ACCEPTED: "ACCEPTED";
    DECLINED: "DECLINED";
    EXPIRED: "EXPIRED";
    CANCELLED: "CANCELLED";
} = {
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    DECLINED: "DECLINED",
    EXPIRED: "EXPIRED",
    CANCELLED: "CANCELLED",
};

export interface IEnterpriseInvitationEntity {
    id: string;
    enterpriseId: string;
    email: string;
    role: EnterpriseRoleType;
    token: string;
    status: InvitationStatusType;
    invitedById: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Invitation with relations
export interface IEnterpriseInvitationWithRelations
    extends IEnterpriseInvitationEntity {
    enterprise: {
        id: string;
        name: string;
        imageUrl: string | null;
    };
    invitedBy?: {
        id: string;
        name: string;
        email: string;
        imageUrl: string | null;
    } | null;
}

