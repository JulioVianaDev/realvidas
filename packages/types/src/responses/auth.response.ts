import { RoleType } from "../entities/user.entity-type";

export interface IAuthLoginResponse {
    token: string;
    role: RoleType;
    id: string;
    email: string;
    emailConfirmed: boolean;
    tenantId?: string | null;
}

/** After password registration — user must enter the 6-digit code (or use the email link). */
export interface IRegisterResponse {
    id: string;
    email: string;
    requiresEmailVerification: true;
}

export interface IResendVerificationResponse {
    message: string;
    userId?: string;
    email?: string;
}

export interface IVerificationLinkContextResponse {
    userId: string;
    email: string;
}
