import { PromotionType } from './product.entity-type';

export interface IComboItem {
    productId: string;
    quantity: number;
}

export interface IComboEntity {
    id: string;
    enterpriseId: string;
    name: string;
    description: string;
    imageUrl: string | null;
    items: IComboItem[];
    /** Price in cents. */
    price: number;
    originalPrice: number | null;
    discountPercent: number | null;
    /** Whether the AI is allowed to offer a promotion/discount on this combo. */
    permitPromotion: boolean;
    /** Type of promotion: PERCENTAGE (integer 0-100) or FIXED_VALUE (cents). */
    promotionType: PromotionType | null;
    /** Promotion value — integer percentage or fixed cents. */
    promotionValue: number | null;
    active: boolean;
    validFrom: Date | null;
    validUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
