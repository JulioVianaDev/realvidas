import {
    RoleType,
    UserUiLanguagePreference,
    UserUiThemePreference,
} from "../entities/user.entity-type";

export interface CreateUserBodyRequest {
    name: string;
    email: string;
    imageUrl?: string;
    cpf?: string;
    password: string;
    role?: RoleType;
    age?: number;
    /** Client locale at sign-up (e.g. pt-BR | en-US). */
    language?: UserUiLanguagePreference;
    /** Client theme at sign-up (next-themes value). */
    theme?: UserUiThemePreference;
}
export interface UpdateUserBodyRequest {
    name?: string;
    email?: string;
    imageUrl?: string;
    cpf?: string;
    role?: RoleType;
    age?: number;
    language?: UserUiLanguagePreference;
    theme?: UserUiThemePreference;
}

/** Authenticated user: persist UI preferences from navbar / settings. */
export interface IPatchUserUiPreferencesBodyRequest {
    language?: UserUiLanguagePreference;
    theme?: UserUiThemePreference;
}

export interface IPatchMyCurrentTenantBodyRequest {
    tenantId: string;
}
