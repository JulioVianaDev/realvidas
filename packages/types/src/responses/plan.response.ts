import { IPlanEntity } from "../entities/plan.entity-type";
import { Paginate } from "../helpers/paginate";

export type IGetAllPlansResponse = Paginate<IPlanEntity>;

export type IGetActivePlansResponse = IPlanEntity[];

export type IGetPlanByIdResponse = IPlanEntity;

export type IGetPlanByNameResponse = IPlanEntity;

export type IPostPlanResponse = IPlanEntity;

export type IPutPlanResponse = IPlanEntity;

export type IDeletePlanResponse = {
    success: boolean;
    id: string;
};
