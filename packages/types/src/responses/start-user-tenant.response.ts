import { ITenantEntity } from "../entities/tenant.entity-type";

export interface IStartUserTenantResponse {
    tenant: ITenantEntity;
    message: string;
}
