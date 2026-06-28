import { API_ROUTES } from "@/api";
import api from "@/axios/axios.v1";
import { IPostTrialBodyRequest, IPutTrialBodyRequest } from "@global-types/body-requests/trial.body-request";
import { IGetTrialsParams } from "@global-types/params/trial.params";
import {
    IPostTrialResponse,
    IGetTrialsResponse,
    IGetTrialByIdResponse,
    IGetTrialByEnterpriseAndUserResponse,
    IPutTrialResponse,
    IDeleteTrialResponse,
} from "@global-types/responses/trial.response";
import { AxiosRequestConfig } from "axios";

export const createTrialAction = async (
    payload: IPostTrialBodyRequest,
): Promise<IPostTrialResponse> => {
    const response = await api.post<IPostTrialResponse>(
        API_ROUTES.TRIAL.CREATE,
        payload,
    );
    return response;
};

export const getAllTrialsAction = async (
    params: IGetTrialsParams,
    config?: AxiosRequestConfig,
): Promise<IGetTrialsResponse> => {
    const response = await api.get<IGetTrialsResponse>(
        API_ROUTES.TRIAL.GET_ALL,
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

export const getTrialByIdAction = async (
    id: string,
): Promise<IGetTrialByIdResponse> => {
    const response = await api.get<IGetTrialByIdResponse>(
        API_ROUTES.TRIAL.GET_BY_ID(id),
    );
    return response;
};

export const getTrialByEnterpriseAndUserAction = async (
): Promise<IGetTrialByEnterpriseAndUserResponse> => {
    const response =
        await api.get<IGetTrialByEnterpriseAndUserResponse>(
            API_ROUTES.TRIAL.GET_MY,
        );
    return response;
};

export const createTrialActionWithUserId = async (
    payload: IPostTrialBodyRequest & { userId: string },
): Promise<IPostTrialResponse> => {
    const { userId, ...restPayload } = payload;
    const response = await api.post<IPostTrialResponse>(
        API_ROUTES.TRIAL.CREATE,
        restPayload,
    );
    return response;
};

export const updateTrialAction = async (
    id: string,
    payload: IPutTrialBodyRequest,
): Promise<IPutTrialResponse> => {
    const response = await api.put<IPutTrialResponse>(
        API_ROUTES.TRIAL.UPDATE(id),
        payload,
    );
    return response;
};

export const deleteTrialAction = async (
    id: string,
): Promise<IDeleteTrialResponse> => {
    const response = await api.delete<IDeleteTrialResponse>(
        API_ROUTES.TRIAL.DELETE(id),
    );
    return response;
};

