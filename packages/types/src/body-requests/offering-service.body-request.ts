export interface IPostCreateOfferingServiceBodyRequest {
    enterpriseId: string;
    categoryId: string;
    name: string;
    description: string;
    durationMin: number;
    price: number;
    originalPrice?: number;
    imageUrl?: string;
    professionalIds?: string[];
    requiresScheduling?: boolean;
    maxPerDay?: number;
    tags?: string[];
    notes?: string;
    active?: boolean;
    featured?: boolean;
    sortOrder?: number;
}

export interface IPutUpdateOfferingServiceBodyRequest {
    categoryId?: string;
    name?: string;
    description?: string;
    durationMin?: number;
    price?: number;
    originalPrice?: number;
    imageUrl?: string;
    professionalIds?: string[];
    requiresScheduling?: boolean;
    maxPerDay?: number;
    tags?: string[];
    notes?: string;
    active?: boolean;
    featured?: boolean;
    sortOrder?: number;
}
