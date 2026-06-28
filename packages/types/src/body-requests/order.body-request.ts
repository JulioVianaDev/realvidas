import { ICartItemSnapshot } from "../entities/cart-item.entity-type";
import { OrderStatus } from "../entities/order.entity-type";

export interface IPostCreatePublicOrderBodyRequest {
    enterpriseId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCpf?: string;
    items: ICartItemSnapshot[];
    subtotal: number;
    discountTotal?: number;
    total: number;
    notes?: string;
}

export interface IPutUpdateOrderStatusBodyRequest {
    status: OrderStatus;
}

export interface IPostPublicLookupOrdersBodyRequest {
    enterpriseId: string;
    customerEmail: string;
    customerPhone: string;
    customerCpf?: string;
}
