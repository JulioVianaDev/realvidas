export interface IPostCreateOfferingCategoryBodyRequest {
    enterpriseId: string;
    name: string;
    slug: string;
    description?: string;
    iconUrl?: string;
    color?: string;
    active?: boolean;
    sortOrder?: number;
}

export interface IPutUpdateOfferingCategoryBodyRequest {
    name?: string;
    slug?: string;
    description?: string;
    iconUrl?: string;
    color?: string;
    active?: boolean;
    sortOrder?: number;
}
