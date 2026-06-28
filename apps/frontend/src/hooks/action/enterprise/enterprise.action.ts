import { API_ROUTES } from "@/api";
import api from "@/axios/axios.v1";
import {
    ICreateEnterpriseBodyRequest,
    IUpdateEnterpriseBodyRequest,
    ITransferEnterpriseOwnershipBodyRequest,
    IUpdateEnterpriseGoogleTokensBodyRequest,
} from "@global-types/body-requests/enterprise.body-request";
import {
    IGetEnterprisesParams,
    IGetMyEnterprisesParams,
} from "@global-types/params/enterprise.params";
import {
    ICreateEnterpriseResponse,
    IGetEnterprisesResponse,
    IGetEnterpriseByIdResponse,
    IGetMyEnterprisesResponse,
    IUpdateEnterpriseResponse,
    IDeleteEnterpriseResponse,
    ITransferOwnershipResponse,
} from "@global-types/responses/enterprise.response";
import { AxiosRequestConfig } from "axios";
import { convertObjectToFormData } from "../convertObjectToFormData";

export type ITenantOption = {
    id: string;
    createdAt: Date;
    createdByUserId: string;
    createdByUserName: string | null;
};

export type IEnterpriseOption = {
    id: string;
    name: string;
};

export const createEnterpriseAction = async (
    payload: ICreateEnterpriseBodyRequest,
): Promise<ICreateEnterpriseResponse> => {
    const { file, ...restPayload } = payload;

    const formData = convertObjectToFormData(
        restPayload,
        file ? [file] : undefined,
    );

    const response = await api.post<ICreateEnterpriseResponse>(
        API_ROUTES.ENTERPRISE.CREATE,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );
    return response;
};

export const getAllEnterprisesAction = async (
    params: IGetEnterprisesParams,
    config?: AxiosRequestConfig,
): Promise<IGetEnterprisesResponse> => {
    const response = await api.get<IGetEnterprisesResponse>(
        API_ROUTES.ENTERPRISE.GET_ALL,
        {
            params: {
                ...params,
                page: params.page ? Number(params.page) : 1,
            },
            ...(config || {}),
        },
    );
    return response;
};

export const getMyEnterprisesAction = async (
    params: IGetMyEnterprisesParams,
    config?: AxiosRequestConfig,
): Promise<IGetMyEnterprisesResponse> => {
    const response = await api.get<IGetMyEnterprisesResponse>(
        API_ROUTES.ENTERPRISE.GET_MY,
        {
            params: {
                ...params,
                page: params.page ? Number(params.page) : 1,
            },
            ...(config || {}),
        },
    );
    return response;
};

export const adminListTenantsAction = async (): Promise<
    ITenantOption[]
> => {
    const response = await api.get<ITenantOption[]>(
        API_ROUTES.ENTERPRISE.ADMIN_LIST_TENANTS,
    );
    return response;
};

export const getEnterprisesByTenantAction = async (
    tenantId: string,
): Promise<IEnterpriseOption[]> => {
    const response = await api.get<IEnterpriseOption[]>(
        API_ROUTES.ENTERPRISE.GET_BY_TENANT(tenantId),
    );
    return response;
};

export const getEnterpriseByIdAction = async (
    id: string,
): Promise<IGetEnterpriseByIdResponse> => {
    const response = await api.get<IGetEnterpriseByIdResponse>(
        API_ROUTES.ENTERPRISE.GET_BY_ID(id),
    );
    return response;
};

export const getEnterpriseBySlugAction = async (
    slug: string,
): Promise<IGetEnterpriseByIdResponse> => {
    const response = await api.get<IGetEnterpriseByIdResponse>(
        API_ROUTES.ENTERPRISE.GET_BY_SLUG(slug),
    );
    return response;
};

export const updateEnterpriseAction = async (
    id: string,
    payload: IUpdateEnterpriseBodyRequest,
): Promise<IUpdateEnterpriseResponse> => {
    const response = await api.patch<IUpdateEnterpriseResponse>(
        API_ROUTES.ENTERPRISE.UPDATE(id),
        payload,
    );
    return response;
};

export const deleteEnterpriseAction = async (
    id: string,
): Promise<IDeleteEnterpriseResponse> => {
    const response = await api.delete<IDeleteEnterpriseResponse>(
        API_ROUTES.ENTERPRISE.DELETE(id),
    );
    return response;
};

export const transferOwnershipAction = async (
    id: string,
    payload: ITransferEnterpriseOwnershipBodyRequest,
): Promise<ITransferOwnershipResponse> => {
    const response = await api.post<ITransferOwnershipResponse>(
        API_ROUTES.ENTERPRISE.TRANSFER_OWNERSHIP(id),
        payload,
    );
    return response;
};

export const updateGoogleTokensAction = async (
    id: string,
    payload: IUpdateEnterpriseGoogleTokensBodyRequest,
): Promise<IUpdateEnterpriseResponse> => {
    const response = await api.patch<IUpdateEnterpriseResponse>(
        API_ROUTES.ENTERPRISE.UPDATE_GOOGLE_TOKENS(id),
        payload,
    );
    return response;
};
