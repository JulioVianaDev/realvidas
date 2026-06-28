import { API_ROUTES } from "@/api";
import api from "@/axios/axios.v1";
import { IGetEnterpriseMembersParams } from "@global-types/params/enterprise-member.params";
import { IGetEnterpriseMembersResponse } from "@global-types/responses/enterprise-member.response";
import { AxiosRequestConfig } from "axios";

export const getEnterpriseMembersAction = async (
    params: IGetEnterpriseMembersParams,
    config?: AxiosRequestConfig,
): Promise<IGetEnterpriseMembersResponse> => {
    const response = await api.get<IGetEnterpriseMembersResponse>(
        API_ROUTES.ENTERPRISE_MEMBER.GET_ALL,
        {
            params: {
                ...params,
                page: params.page ? Number(params.page) : 1,
                pageSize: params.pageSize || 100, // Large page size to get all members
            },
            ...(config || {}),
        }
    );
    return response;
};

