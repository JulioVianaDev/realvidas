import { IStartUserTenantBodyRequest } from "@global-types/body-requests/start-user-tenant.body-request";
import { IStartUserTenantResponse } from "@global-types/responses/start-user-tenant.response";
import { API_ROUTES } from "@/api";
import api from "@/axios/axios.v1";

export const startUserTenantAction = async (
    payload: IStartUserTenantBodyRequest,
): Promise<IStartUserTenantResponse> => {
    const response = await api.post<IStartUserTenantResponse>(
        API_ROUTES.START_USER_TENANT.CREATE,
        payload,
    );
    return response;
};
