import { Paginate } from "../helpers/paginate";
import { IOfferingCategoryEntity } from "../entities/offering-category.entity-type";

export type IGetAllOfferingCategoriesResponse = Paginate<IOfferingCategoryEntity>;
export type IGetOfferingCategoryByIdResponse = IOfferingCategoryEntity | null;
export type IPostCreateOfferingCategoryResponse = IOfferingCategoryEntity;
export type IPutUpdateOfferingCategoryResponse = IOfferingCategoryEntity;

export interface IDeleteOfferingCategoryResponse {
    success: boolean;
    id: string;
}
