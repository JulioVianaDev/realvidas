import { ICartItemSnapshot } from "./cart-item.entity-type";

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";

export const ORDER_STATUS_VALUES: OrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "delivered",
    "cancelled",
];

export interface IOrderEntity {
    id: string;
    enterpriseId: string;
    customerId: string | null;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    customerCpf: string | null;
    items: ICartItemSnapshot[];
    /** Price totals in cents. */
    subtotal: number;
    discountTotal: number;
    total: number;
    status: OrderStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
