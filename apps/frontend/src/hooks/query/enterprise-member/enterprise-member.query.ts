import { getEnterpriseMembersAction } from "@/hooks/action/enterprise-member/enterprise-member.action";
import { useQuery } from "@tanstack/react-query";
import { Exact } from "@global-types/helpers/exact";
import { IGetEnterpriseMembersParams } from "@global-types/params/enterprise-member.params";
import { IGetEnterpriseMembersResponse } from "@global-types/responses/enterprise-member.response";
import { queryKeys } from "../query-keys";
import type { QueryResult } from "../query-result.types";

export const useGetEnterpriseMembersQuery = (
    params: Exact<IGetEnterpriseMembersParams, IGetEnterpriseMembersParams>,
): QueryResult<IGetEnterpriseMembersResponse> => {
    const enabled = !!params.enterpriseId && params.enterpriseId.trim() !== '';

    return useQuery<IGetEnterpriseMembersResponse>({
        queryKey: queryKeys.enterpriseMember.list(params),
        queryFn: async () => {
            return await getEnterpriseMembersAction(params);
        },
        enabled,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: false,
    });
};
