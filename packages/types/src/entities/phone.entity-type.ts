export interface IPhoneEntity {
    id: string;
    phoneNumber: string;
    country: string;
    isActive: boolean;
    hasWhatsapp: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    entityType: IEntityPhone;
    entityId: string;
    enterpriseId: string | null;
}

export type IEntityPhone = "ENTERPRISE" | "USER" | "CLIENT";