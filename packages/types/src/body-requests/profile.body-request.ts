import { AppModule } from "../entities/profile.entity-type";

export interface ICreateProfileBodyRequest {
    name: string;
    /** Allowed module keys (UPPERCASE). Ignored when permitAll is true. */
    modules: AppModule[];
    permitAll: boolean;
}

export interface IUpdateProfileBodyRequest {
    name?: string;
    modules?: AppModule[];
    permitAll?: boolean;
}

/** Replaces the full set of profiles linked to a user (the vinculus). */
export interface IAssignUserProfilesBodyRequest {
    userId: string;
    profileIds: string[];
}
