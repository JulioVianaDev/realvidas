import { RoleType } from "../entities/user.entity-type";
export interface GetUsersParams {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: RoleType | "ALL";
}
