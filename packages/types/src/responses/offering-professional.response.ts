import { Paginate } from "../helpers/paginate";
import { IOfferingProfessionalEntity } from "../entities/offering-professional.entity-type";

export type IGetAllOfferingProfessionalsResponse = Paginate<IOfferingProfessionalEntity>;
export type IGetOfferingProfessionalByIdResponse = IOfferingProfessionalEntity | null;
export type IPostCreateOfferingProfessionalResponse = IOfferingProfessionalEntity;
export type IPutUpdateOfferingProfessionalResponse = IOfferingProfessionalEntity;

export interface IDeleteOfferingProfessionalResponse {
    success: boolean;
    id: string;
}
