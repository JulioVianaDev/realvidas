export interface ILoginBodyRequest {
    email: string;
    password: string;
}

export interface IVerifyRegistrationCodeBodyRequest {
    userId: string;
    /** Six digits sent by email. */
    code: string;
}

export interface IConfirmEmailLinkBodyRequest {
    /** JWT from the welcome / email link (5-minute expiry). */
    token: string;
}

export interface IResendVerificationCodeBodyRequest {
    userId: string;
}

export interface IResendVerificationFromLinkBodyRequest {
    /** Same JWT from the email (can be expired); server decodes without verify to get user id. */
    token: string;
}

/** Same token body as confirm-email — used to resolve user when the link JWT is expired. */
export type IVerificationLinkContextBodyRequest = IConfirmEmailLinkBodyRequest;