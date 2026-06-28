export interface ICatalogCategoryEntity {
    id: string;
    enterpriseId: string;
    name: string;
    slug: string;
    description: string | null;
    iconUrl: string | null;
    active: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
