import { Paginate } from "../helpers/paginate";
import {
    IEnterpriseMemberEntity,
    IEnterpriseMemberWithUser,
    IEnterpriseMemberFull,
} from "../entities/enterprise-member.entity-type";

export type IGetEnterpriseMembersResponse = Paginate<IEnterpriseMemberWithUser>;

export type IGetEnterpriseMemberByIdResponse = IEnterpriseMemberFull | null;

export type IAddEnterpriseMemberResponse = IEnterpriseMemberWithUser;

export type IUpdateEnterpriseMemberResponse = IEnterpriseMemberWithUser;

export interface IDeleteEnterpriseMemberResponse {
    success: boolean;
    id: string;
}

