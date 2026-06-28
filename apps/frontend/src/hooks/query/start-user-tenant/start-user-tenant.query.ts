import { useMutation } from "@tanstack/react-query";
import { IStartUserTenantBodyRequest } from "@global-types/body-requests/start-user-tenant.body-request";
import { IStartUserTenantResponse } from "@global-types/responses/start-user-tenant.response";
import { startUserTenantAction } from "@/hooks/action/start-user-tenant/start-user-tenant.action";
import type { MutationResult } from "../query-result.types";

export const useStartUserTenantMutation = (): MutationResult<
    IStartUserTenantResponse,
    IStartUserTenantBodyRequest
> => {
    return useMutation<
        IStartUserTenantResponse,
        Error,
        IStartUserTenantBodyRequest
    >({
        mutationFn: async (payload) => {
            return await startUserTenantAction(payload);
        },
    });
};
