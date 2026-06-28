import { API_ROUTES } from "@/api";
import api from "@/axios/axios.v1";
import {
    ICreateTenantUserBodyRequest,
    IUpdateTenantUserBodyRequest,
} from "@global-types/body-requests/tenant-user.body-request";
import { IGetTenantUsersParams } from "@global-types/params/tenant-user.params";
import {
    IGetTenantUsersResponse,
    ICreateTenantUserResponse,
    IUpdateTenantUserResponse,
    IDeleteTenantUserResponse,
} from "@global-types/responses/tenant-user.response";
import { AxiosRequestConfig } from "axios";

export const getTenantUsersAction = async (
    params: IGetTenantUsersParams,
    config?: AxiosRequestConfig,
): Promise<IGetTenantUsersResponse> => {
    const response = await api.get<IGetTenantUsersResponse>(
        API_ROUTES.TENANT_USER.GET_ALL,
        {
            params: {
                ...params,
                page: params.page ? Number(params.page) : 1,
                pageSize: params.pageSize || 20,
            },
            ...(config || {}),
        },
    );
    return response;
};

export const createTenantUserAction = async (
    payload: ICreateTenantUserBodyRequest,
): Promise<ICreateTenantUserResponse> => {
    const response = await api.post<ICreateTenantUserResponse>(
        API_ROUTES.TENANT_USER.CREATE,
        payload,
    );
    return response;
};

export const updateTenantUserAction = async (
    userId: string,
    payload: IUpdateTenantUserBodyRequest,
): Promise<IUpdateTenantUserResponse> => {
    const response = await api.patch<IUpdateTenantUserResponse>(
        API_ROUTES.TENANT_USER.UPDATE(userId),
        payload,
    );
    return response;
};

export const deleteTenantUserAction = async (
    userId: string,
): Promise<IDeleteTenantUserResponse> => {
    const response = await api.delete<IDeleteTenantUserResponse>(
        API_ROUTES.TENANT_USER.DELETE(userId),
    );
    return response;
};
