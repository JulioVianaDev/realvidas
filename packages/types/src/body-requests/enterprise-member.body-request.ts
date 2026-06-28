import { EnterpriseRoleType } from "../entities/enterprise-member.entity-type";

export interface IAddEnterpriseMemberBodyRequest {
    userId: string;
    role: EnterpriseRoleType;
}

export interface IUpdateEnterpriseMemberBodyRequest {
    role?: EnterpriseRoleType;
    isActive?: boolean;
}
