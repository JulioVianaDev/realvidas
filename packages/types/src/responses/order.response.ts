import { Paginate } from "../helpers/paginate";
import { IOrderEntity } from "../entities/order.entity-type";

export type IGetAllOrdersResponse = Paginate<IOrderEntity>;
export type IGetOrderByIdResponse = IOrderEntity | null;
export type IPostCreateOrderResponse = IOrderEntity;
export type IPutUpdateOrderStatusResponse = IOrderEntity;
export type IPostPublicLookupOrdersResponse = IOrderEntity[];

export interface IDeleteOrderResponse {
    success: boolean;
    id: string;
}
