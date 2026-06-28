export interface IAddEmployeeGoogleEmailBodyRequest {
    email: string;
    isPrimary?: boolean;
}

export interface IUpdateEmployeeGoogleEmailBodyRequest {
    refreshToken?: string;
    accessToken?: string;
    tokenExpiresAt?: Date;
    isPrimary?: boolean;
    isActive?: boolean;
}

