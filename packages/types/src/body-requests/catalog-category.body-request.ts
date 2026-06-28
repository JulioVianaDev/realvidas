export interface IPostCreateCatalogCategoryBodyRequest {
    enterpriseId: string;
    name: string;
    slug: string;
    description?: string;
    iconUrl?: string;
    active?: boolean;
    sortOrder?: number;
}

export interface IPutUpdateCatalogCategoryBodyRequest {
    name?: string;
    slug?: string;
    description?: string;
    iconUrl?: string;
    active?: boolean;
    sortOrder?: number;
}
