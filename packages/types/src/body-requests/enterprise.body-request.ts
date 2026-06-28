export interface IPhoneData {
    phone: string;
    country: string;
}

export interface ICreateEnterpriseBodyRequest {
    name: string;
    file?: File;
    cpf?: string | null;
    cnpj?: string | null;
    email?: string | null;
    /** Max 2024 characters. */
    description?: string | null;
    phone?: IPhoneData | null;
    imageUrl?: string | null;
    timezone?: string | null;
    shortPath?: string | null;
}

export interface IUpdateEnterpriseBodyRequest {
    name?: string;
    file?: File;
    cpf?: string | null;
    cnpj?: string | null;
    email?: string | null;
    /** Max 2024 characters. */
    description?: string | null;
    phone?: IPhoneData | null;
    imageUrl?: string | null;
    timezone?: string | null;
    shortPath?: string | null;
    isActive?: boolean;
}

export interface ITransferEnterpriseOwnershipBodyRequest {
    newOwnerId: string;
}

export interface IUpdateEnterpriseGoogleTokensBodyRequest {
    mainGoogleEmail: string;
    googleRefreshToken: string;
    googleAccessToken: string;
    tokenExpiresAt: Date;
}
