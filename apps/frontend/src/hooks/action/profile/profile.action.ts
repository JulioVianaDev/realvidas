import { API_ROUTES } from "@/api";
import api from "@/axios/axios.v1";
import {
    ICreateProfileBodyRequest,
    IUpdateProfileBodyRequest,
    IAssignUserProfilesBodyRequest,
} from "@global-types/body-requests/profile.body-request";
import { IGetProfilesParams } from "@global-types/params/profile.params";
import {
    IGetProfilesResponse,
    IGetProfileByIdResponse,
    ICreateProfileResponse,
    IUpdateProfileResponse,
    IDeleteProfileResponse,
    IGetUserAssignedProfilesResponse,
    IAssignUserProfilesResponse,
    IGetMyUserProfileResponse,
} from "@global-types/responses/profile.response";
import { AxiosRequestConfig } from "axios";

export const getProfilesAction = async (
    params: IGetProfilesParams,
    config?: AxiosRequestConfig,
): Promise<IGetProfilesResponse> => {
    const response = await api.get<IGetProfilesResponse>(
        API_ROUTES.PROFILE.GET_ALL,
        {
            params: {
                ...params,
                page: params.page ? Number(params.page) : 1,
                pageSize: params.pageSize || 50,
            },
            ...(config || {}),
        },
    );
    return response;
};

export const getMyPermissionsAction =
    async (): Promise<IGetMyUserProfileResponse> => {
        const response = await api.get<IGetMyUserProfileResponse>(
            API_ROUTES.PROFILE.GET_MINE,
        );
        return response;
    };

export const getProfileByIdAction = async (
    id: string,
): Promise<IGetProfileByIdResponse> => {
    const response = await api.get<IGetProfileByIdResponse>(
        API_ROUTES.PROFILE.GET_BY_ID(id),
    );
    return response;
};

export const getUserProfilesAction = async (
    userId: string,
): Promise<IGetUserAssignedProfilesResponse> => {
    const response = await api.get<IGetUserAssignedProfilesResponse>(
        API_ROUTES.PROFILE.GET_BY_USER(userId),
    );
    return response;
};

export const createProfileAction = async (
    payload: ICreateProfileBodyRequest,
): Promise<ICreateProfileResponse> => {
    const response = await api.post<ICreateProfileResponse>(
        API_ROUTES.PROFILE.CREATE,
        payload,
    );
    return response;
};

export const updateProfileAction = async (
    id: string,
    payload: IUpdateProfileBodyRequest,
): Promise<IUpdateProfileResponse> => {
    const response = await api.patch<IUpdateProfileResponse>(
        API_ROUTES.PROFILE.UPDATE(id),
        payload,
    );
    return response;
};

export const deleteProfileAction = async (
    id: string,
): Promise<IDeleteProfileResponse> => {
    const response = await api.delete<IDeleteProfileResponse>(
        API_ROUTES.PROFILE.DELETE(id),
    );
    return response;
};

export const assignUserProfilesAction = async (
    payload: IAssignUserProfilesBodyRequest,
): Promise<IAssignUserProfilesResponse> => {
    const response = await api.post<IAssignUserProfilesResponse>(
        API_ROUTES.PROFILE.ASSIGN,
        payload,
    );
    return response;
};
