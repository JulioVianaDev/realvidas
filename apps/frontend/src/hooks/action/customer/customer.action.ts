import { API_ROUTES } from "@/api";
import api from "@/axios/axios.v1";
import {
    ICreateCustomerBodyRequest,
    IUpdateCustomerBodyRequest,
} from "@global-types/body-requests/customer.body-request";
import { IGetAllCustomersParams } from "@global-types/params/customer.params";
import {
    IGetAllCustomersResponse,
    IGetCustomerByIdResponse,
    ICreateCustomerResponse,
    IUpdateCustomerResponse,
    IDeleteCustomerResponse,
} from "@global-types/responses/customer.response";
import { AxiosRequestConfig } from "axios";

export const getCustomersAction = async (
    params: IGetAllCustomersParams,
    config?: AxiosRequestConfig,
): Promise<IGetAllCustomersResponse> => {
    const response = await api.get<IGetAllCustomersResponse>(
        API_ROUTES.CUSTOMER.GET_ALL,
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

export const getCustomerByIdAction = async (
    id: string,
): Promise<IGetCustomerByIdResponse> => {
    const response = await api.get<IGetCustomerByIdResponse>(
        API_ROUTES.CUSTOMER.GET_BY_ID(id),
    );
    return response;
};

export const createCustomerAction = async (
    payload: ICreateCustomerBodyRequest,
): Promise<ICreateCustomerResponse> => {
    const response = await api.post<ICreateCustomerResponse>(
        API_ROUTES.CUSTOMER.CREATE,
        payload,
    );
    return response;
};

export const updateCustomerAction = async (
    id: string,
    payload: IUpdateCustomerBodyRequest,
): Promise<IUpdateCustomerResponse> => {
    const response = await api.patch<IUpdateCustomerResponse>(
        API_ROUTES.CUSTOMER.UPDATE(id),
        payload,
    );
    return response;
};

export const deleteCustomerAction = async (
    id: string,
): Promise<IDeleteCustomerResponse> => {
    const response = await api.delete<IDeleteCustomerResponse>(
        API_ROUTES.CUSTOMER.DELETE(id),
    );
    return response;
};
