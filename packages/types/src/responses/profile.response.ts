import { Paginate } from "../helpers/paginate";
import {
    IProfileEntity,
    IUserEffectivePermissions,
} from "../entities/profile.entity-type";

export type IGetProfilesResponse = Paginate<IProfileEntity>;

export type IGetProfileByIdResponse = IProfileEntity | null;

export type ICreateProfileResponse = IProfileEntity;

export type IUpdateProfileResponse = IProfileEntity;

export interface IDeleteProfileResponse {
    success: boolean;
    id: string;
}

/** Profiles currently linked to a given user. */
export type IGetUserAssignedProfilesResponse = IProfileEntity[];

export interface IAssignUserProfilesResponse {
    userId: string;
    profileIds: string[];
}

/** Effective permissions for the authenticated user (sidebar consumes this). */
export type IGetMyUserProfileResponse = IUserEffectivePermissions;
