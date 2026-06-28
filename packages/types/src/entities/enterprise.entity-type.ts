import { IPhoneEntity } from "./phone.entity-type";

/** Max length for `IEnterpriseEntity.description` (aligned with DB). */
export const ENTERPRISE_DESCRIPTION_MAX_LENGTH = 2024 as const;

// Enterprise Entity Types

export type PlanType =
    | "FREE"
    | "BASIC"
    | "PROFESSIONAL"
    | "ENTERPRISE"
    | "CUSTOM";

export const PlanValues: {
    FREE: "FREE";
    BASIC: "BASIC";
    PROFESSIONAL: "PROFESSIONAL";
    ENTERPRISE: "ENTERPRISE";
} = {
    FREE: "FREE",
    BASIC: "BASIC",
    PROFESSIONAL: "PROFESSIONAL",
    ENTERPRISE: "ENTERPRISE",
};

export interface IEnterpriseEntity {
    id: string;
    name: string;
    cpf: string | null;
    cnpj: string | null;
    email: string | null;
    /** How the company works, segment, culture, etc. */
    description: string | null;
    phone: IPhoneEntity | null;
    imageUrl: string | null;
    isActive: boolean;
    ownerId: string;

    // Google Calendar Integration
    mainGoogleEmail: string | null;
    googleRefreshToken: string | null;
    googleAccessToken: string | null;
    tokenExpiresAt: Date | null;
    timezone: string | null;

    /** If true, public catalog/cart requires customer CPF on checkout. */
    needCpfInCatalog: boolean;

    /** Public URL segment — mirrors the main DB url_shorteners row. */
    shortPath: string | null;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

// Enterprise with relations
export interface IEnterpriseWithOwner extends IEnterpriseEntity {
    owner: {
        id: string;
        name: string;
        email: string;
        imageUrl: string | null;
    };
}

export interface IEnterpriseWithMembersCount
    extends IEnterpriseEntity {
    _count: {
        members: number;
        calendars: number;
    };
}
