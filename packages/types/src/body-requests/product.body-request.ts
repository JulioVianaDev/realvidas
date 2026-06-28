import { IIncrementGroup, PromotionType } from "../entities/product.entity-type";

export interface IPostCreateProductBodyRequest {
    enterpriseId: string;
    categoryId: string;
    name: string;
    description: string;
    imageUrl?: string;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
    permitPromotion?: boolean;
    promotionType?: PromotionType;
    promotionValue?: number;
    incrementGroups?: IIncrementGroup[];
    tags?: string[];
    active?: boolean;
    featured?: boolean;
    sortOrder?: number;
}

export interface IPutUpdateProductBodyRequest {
    categoryId?: string;
    name?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    originalPrice?: number;
    discountPercent?: number;
    permitPromotion?: boolean;
    promotionType?: PromotionType;
    promotionValue?: number;
    incrementGroups?: IIncrementGroup[];
    tags?: string[];
    active?: boolean;
    featured?: boolean;
    sortOrder?: number;
}
