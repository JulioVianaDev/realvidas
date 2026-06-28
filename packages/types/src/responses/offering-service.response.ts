import { Paginate } from "../helpers/paginate";
import { IOfferingServiceEntity } from "../entities/offering-service.entity-type";

export type IGetAllOfferingServicesResponse = Paginate<IOfferingServiceEntity>;
export type IGetOfferingServiceByIdResponse = IOfferingServiceEntity | null;
export type IPostCreateOfferingServiceResponse = IOfferingServiceEntity;
export type IPutUpdateOfferingServiceResponse = IOfferingServiceEntity;

export interface IDeleteOfferingServiceResponse {
    success: boolean;
    id: string;
}
