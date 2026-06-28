import { Paginate } from "../helpers/paginate";
import { IComboEntity } from "../entities/combo.entity-type";

export type IGetAllCombosResponse = Paginate<IComboEntity>;
export type IGetComboByIdResponse = IComboEntity | null;
export type IPostCreateComboResponse = IComboEntity;
export type IPutUpdateComboResponse = IComboEntity;

export interface IDeleteComboResponse {
    success: boolean;
    id: string;
}
