export interface IPostCreateOfferingProfessionalBodyRequest {
    enterpriseId: string;
    name: string;
    role: string;
    avatarUrl?: string;
    bio?: string;
    specialties?: string[];
    active?: boolean;
}

export interface IPutUpdateOfferingProfessionalBodyRequest {
    name?: string;
    role?: string;
    avatarUrl?: string;
    bio?: string;
    specialties?: string[];
    active?: boolean;
}
