export interface IOfferingProfessionalEntity {
    id: string;
    enterpriseId: string;
    name: string;
    role: string;
    avatarUrl: string | null;
    bio: string | null;
    specialties: string[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
