/** Stored in DB column auth_codes (jsonb) while email verification is pending. */
export type IUserAuthCodesPayload = {
    code: string;
    /** ISO 8601 — code invalid after this instant (e.g. 5 minutes from send). */
    expiresAt: string;
};
