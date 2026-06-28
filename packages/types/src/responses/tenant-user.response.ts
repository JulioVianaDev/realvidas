import { Paginate } from "../helpers/paginate";
import { ITenantUserEntity } from "../entities/tenant-user.entity-type";

export type IGetTenantUsersResponse = Paginate<ITenantUserEntity>;

export type ICreateTenantUserResponse = ITenantUserEntity;

export type IUpdateTenantUserResponse = ITenantUserEntity;

export interface IDeleteTenantUserResponse {
    success: boolean;
    id: string;
}
