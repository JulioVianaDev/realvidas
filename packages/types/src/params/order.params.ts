import { OrderStatus } from "../entities/order.entity-type";

export interface IGetAllOrdersParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    status?: OrderStatus;
    search?: string;
}

export interface IGetOrderByIdParams {
    id: string;
}

export interface IOrderEnterpriseQueryParams {
    enterpriseId: string;
}
