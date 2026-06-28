import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { Exact } from "@global-types/helpers/exact";
import { IGetTenantUsersParams } from "@global-types/params/tenant-user.params";
import {
    ICreateTenantUserBodyRequest,
    IUpdateTenantUserBodyRequest,
} from "@global-types/body-requests/tenant-user.body-request";
import {
    IGetTenantUsersResponse,
    ICreateTenantUserResponse,
    IUpdateTenantUserResponse,
    IDeleteTenantUserResponse,
} from "@global-types/responses/tenant-user.response";
import {
    getTenantUsersAction,
    createTenantUserAction,
    updateTenantUserAction,
    deleteTenantUserAction,
} from "@/hooks/action/tenant-user/tenant-user.action";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/contexts/TranslationsContext";
import { extractAxiosErrorMessage } from "@/lib/extract-axios-error-message";
import { queryKeys } from "../query-keys";
import type {
    QueryResult,
    MutationResult,
} from "../query-result.types";

export const useGetTenantUsersQuery = (
    params: Exact<IGetTenantUsersParams, IGetTenantUsersParams>,
    enabled = true,
): QueryResult<IGetTenantUsersResponse> => {
    return useQuery<IGetTenantUsersResponse>({
        queryKey: queryKeys.tenantUser.list(params),
        queryFn: async () => await getTenantUsersAction(params),
        enabled,
        refetchOnMount: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });
};

export const useCreateTenantUserMutation = (): MutationResult<
    ICreateTenantUserResponse,
    ICreateTenantUserBodyRequest
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<
        ICreateTenantUserResponse,
        Error,
        ICreateTenantUserBodyRequest
    >({
        mutationFn: async (payload) =>
            await createTenantUserAction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.tenantUser.all(),
            });
            toast({ title: t("tenantUser.toast.createSuccess") });
        },
        onError: (error) => {
            toast({
                title: t("tenantUser.toast.createError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("tenantUser.toast.createErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};

export const useUpdateTenantUserMutation = (): MutationResult<
    IUpdateTenantUserResponse,
    { userId: string; payload: IUpdateTenantUserBodyRequest }
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<
        IUpdateTenantUserResponse,
        Error,
        { userId: string; payload: IUpdateTenantUserBodyRequest }
    >({
        mutationFn: async ({ userId, payload }) =>
            await updateTenantUserAction(userId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.tenantUser.all(),
            });
            toast({ title: t("tenantUser.toast.updateSuccess") });
        },
        onError: (error) => {
            toast({
                title: t("tenantUser.toast.updateError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("tenantUser.toast.updateErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};

export const useDeleteTenantUserMutation = (): MutationResult<
    IDeleteTenantUserResponse,
    string
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<IDeleteTenantUserResponse, Error, string>({
        mutationFn: async (userId) =>
            await deleteTenantUserAction(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.tenantUser.all(),
            });
            toast({ title: t("tenantUser.toast.deleteSuccess") });
        },
        onError: (error) => {
            toast({
                title: t("tenantUser.toast.deleteError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("tenantUser.toast.deleteErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};
