/** Create an employee user inside the current tenant. */
export interface ICreateTenantUserBodyRequest {
    name: string;
    email: string;
    password: string;
    cpf?: string;
    /** Profiles to link the new user to (the vinculus). */
    profileIds: string[];
}

/** Update a tenant user. When `profileIds` is provided it replaces their links. */
export interface IUpdateTenantUserBodyRequest {
    name?: string;
    email?: string;
    cpf?: string;
    profileIds?: string[];
}
