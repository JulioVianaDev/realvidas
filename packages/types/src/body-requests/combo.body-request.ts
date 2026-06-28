import { IComboItem } from "../entities/combo.entity-type";
import { PromotionType } from "../entities/product.entity-type";

export interface IPostCreateComboBodyRequest {
    enterpriseId: string;
    name: string;
    description: string;
    imageUrl?: string;
    items: IComboItem[];
    price: number;
    originalPrice?: number;
    discountPercent?: number;
    permitPromotion?: boolean;
    promotionType?: PromotionType;
    promotionValue?: number;
    active?: boolean;
    validFrom?: string;
    validUntil?: string;
}

export interface IPutUpdateComboBodyRequest {
    name?: string;
    description?: string;
    imageUrl?: string;
    items?: IComboItem[];
    price?: number;
    originalPrice?: number;
    discountPercent?: number;
    permitPromotion?: boolean;
    promotionType?: PromotionType;
    promotionValue?: number;
    active?: boolean;
    validFrom?: string;
    validUntil?: string;
}
