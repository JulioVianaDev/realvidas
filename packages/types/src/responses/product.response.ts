import { Paginate } from "../helpers/paginate";
import { IProductEntity } from "../entities/product.entity-type";

export type IGetAllProductsResponse = Paginate<IProductEntity>;
export type IGetProductByIdResponse = IProductEntity | null;
export type IPostCreateProductResponse = IProductEntity;
export type IPutUpdateProductResponse = IProductEntity;

export interface IDeleteProductResponse {
    success: boolean;
    id: string;
}
