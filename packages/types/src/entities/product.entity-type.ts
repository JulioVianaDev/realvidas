export interface IIncrement {
    id: string;
    name: string;
    /** Price in cents. */
    price: number;
    max: number;
    required: boolean;
    active: boolean;
}

export interface IIncrementGroup {
    id: string;
    label: string;
    minSelections: number;
    maxSelections: number;
    increments: IIncrement[];
}

export type PromotionType = 'PERCENTAGE' | 'FIXED_VALUE';

export const PROMOTION_TYPE_VALUES: PromotionType[] = ['PERCENTAGE', 'FIXED_VALUE'];

export interface IProductEntity {
    id: string;
    enterpriseId: string;
    categoryId: string;
    name: string;
    description: string;
    imageUrl: string | null;
    /** Price in cents. */
    price: number;
    originalPrice: number | null;
    discountPercent: number | null;
    /** Whether the AI is allowed to offer a promotion/discount on this product. */
    permitPromotion: boolean;
    /** Type of promotion: PERCENTAGE (integer 0-100) or FIXED_VALUE (cents). */
    promotionType: PromotionType | null;
    /** Promotion value — integer percentage (e.g. 10 = 10%) or fixed cents (e.g. 500 = R$5,00). */
    promotionValue: number | null;
    incrementGroups: IIncrementGroup[];
    tags: string[];
    active: boolean;
    featured: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
