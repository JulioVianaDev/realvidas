import { EnterpriseRoleType } from "../entities/enterprise-member.entity-type";

export interface IGetEnterpriseMembersParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    role?: EnterpriseRoleType | "ALL";
    isActive?: boolean;
}

export interface IGetEnterpriseMemberByIdParams {
    id: string;
}

export interface IGetEnterpriseMemberByUserParams {
    enterpriseId: string;
    userId: string;
}
