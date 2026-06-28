import { Paginate } from "../helpers/paginate";
import { ICatalogCategoryEntity } from "../entities/catalog-category.entity-type";

export type IGetAllCatalogCategoriesResponse = Paginate<ICatalogCategoryEntity>;
export type IGetCatalogCategoryByIdResponse = ICatalogCategoryEntity | null;
export type IPostCreateCatalogCategoryResponse = ICatalogCategoryEntity;
export type IPutUpdateCatalogCategoryResponse = ICatalogCategoryEntity;

export interface IDeleteCatalogCategoryResponse {
    success: boolean;
    id: string;
}
