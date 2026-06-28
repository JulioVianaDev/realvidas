import { RoleType } from "./user.entity-type";

/** Slim view of a profile linked to a user (for the users list). */
export interface ITenantUserProfileSummary {
    id: string;
    name: string;
    permitAll: boolean;
}

/** A user that belongs to the current tenant, with their linked profiles. */
export interface ITenantUserEntity {
    id: string;
    name: string;
    email: string;
    cpf: string | null;
    imageUrl: string | null;
    role: RoleType;
    profiles: ITenantUserProfileSummary[];
}
