import {
    adminListTenantsAction,
    createEnterpriseAction,
    deleteEnterpriseAction,
    getEnterprisesByTenantAction,
    getAllEnterprisesAction,
    getEnterpriseByIdAction,
    getEnterpriseBySlugAction,
    getMyEnterprisesAction,
    IEnterpriseOption,
    ITenantOption,
    updateEnterpriseAction,
    transferOwnershipAction,
    updateGoogleTokensAction,
} from "@/hooks/action/enterprise/enterprise.action";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Exact } from "@global-types/helpers/exact";
import {
    IGetEnterprisesParams,
    IGetMyEnterprisesParams
} from "@global-types/params/enterprise.params";
import {
    IGetEnterprisesResponse,
    IGetEnterpriseByIdResponse,
    IGetMyEnterprisesResponse,
    ICreateEnterpriseResponse,
    IUpdateEnterpriseResponse,
    IDeleteEnterpriseResponse,
    ITransferOwnershipResponse,
} from "@global-types/responses/enterprise.response";
import {
    ICreateEnterpriseBodyRequest,
    IUpdateEnterpriseBodyRequest,
    ITransferEnterpriseOwnershipBodyRequest,
    IUpdateEnterpriseGoogleTokensBodyRequest,
} from "@global-types/body-requests/enterprise.body-request";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/contexts/TranslationsContext";
import { extractAxiosErrorMessage } from "@/lib/extract-axios-error-message";
import { queryKeys } from "../query-keys";
import type { MutationResult, QueryResult } from "../query-result.types";

export const useGetAllEnterprisesQuery = (
    params: Exact<IGetEnterprisesParams, IGetEnterprisesParams>,
): QueryResult<IGetEnterprisesResponse> => {
    return useQuery<IGetEnterprisesResponse>({
        queryKey: queryKeys.enterprise.list(params),
        queryFn: async () => {
            return await getAllEnterprisesAction(params);
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: false,
    });
};

export const useGetMyEnterprisesQuery = (
    params: Exact<IGetMyEnterprisesParams, IGetMyEnterprisesParams>,
    enabled = true,
): QueryResult<IGetMyEnterprisesResponse> => {
    return useQuery<IGetMyEnterprisesResponse>({
        queryKey: queryKeys.enterprise.myList(params),
        queryFn: async () => {
            return await getMyEnterprisesAction(params);
        },
        enabled,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: false,
    });
};

export const useAdminListTenantsQuery = (
    enabled = true,
): QueryResult<ITenantOption[]> => {
    return useQuery<ITenantOption[]>({
        queryKey: queryKeys.enterprise.adminTenants(),
        queryFn: async () => await adminListTenantsAction(),
        enabled,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: false,
    });
};

export const useGetEnterprisesByTenantQuery = (
    tenantId: string | null | undefined,
    enabled = true,
): QueryResult<IEnterpriseOption[]> => {
    return useQuery<IEnterpriseOption[]>({
        queryKey: queryKeys.enterprise.byTenant(tenantId || ""),
        queryFn: async () => {
            if (!tenantId) return [];
            return await getEnterprisesByTenantAction(tenantId);
        },
        enabled: enabled && !!tenantId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: false,
    });
};

export const useGetEnterpriseByIdQuery = (
    id: string | undefined,
): QueryResult<IGetEnterpriseByIdResponse> => {
    return useQuery<IGetEnterpriseByIdResponse>({
        queryKey: queryKeys.enterprise.detail(id || ""),
        queryFn: async () => {
            if (!id) return null;
            return await getEnterpriseByIdAction(id);
        },
        enabled: !!id,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: false,
    });
};

export const useGetEnterpriseBySlugQuery = (
    slug: string | undefined,
): QueryResult<IGetEnterpriseByIdResponse> => {
    return useQuery<IGetEnterpriseByIdResponse>({
        queryKey: queryKeys.enterprise.bySlug(slug || ""),
        queryFn: async () => {
            if (!slug) return null;
            return await getEnterpriseBySlugAction(slug);
        },
        enabled: !!slug,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: false,
    });
};

export const useCreateEnterpriseMutation = (): MutationResult<
    ICreateEnterpriseResponse,
    ICreateEnterpriseBodyRequest
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<
        ICreateEnterpriseResponse,
        Error,
        ICreateEnterpriseBodyRequest
    >({
        mutationFn: async (payload) => {
            return await createEnterpriseAction(payload);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.enterprise.my(),
            });
            toast({
                title: t("enterprise.toast.createSuccess"),
                description: t("enterprise.toast.createSuccessDescription", { name: response.name }),
            });
        },
        onError: (error) => {
            toast({
                title: t("enterprise.toast.createError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("enterprise.toast.createErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};

export const useUpdateEnterpriseMutation = (): MutationResult<
    IUpdateEnterpriseResponse,
    { id: string; data: IUpdateEnterpriseBodyRequest }
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<
        IUpdateEnterpriseResponse,
        Error,
        { id: string; data: IUpdateEnterpriseBodyRequest }
    >({
        mutationFn: async (payload) => {
            return await updateEnterpriseAction(payload.id, payload.data);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.enterprise.my(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.enterprise.detail(response.id),
            });
            toast({
                title: t("enterprise.toast.updateSuccess"),
                description: t("enterprise.toast.updateSuccessDescription", { name: response.name }),
            });
        },
        onError: (error) => {
            toast({
                title: t("enterprise.toast.updateError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("enterprise.toast.updateErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};

export const useDeleteEnterpriseMutation = (): MutationResult<
    IDeleteEnterpriseResponse,
    string
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<IDeleteEnterpriseResponse, Error, string>({
        mutationFn: async (id) => {
            return await deleteEnterpriseAction(id);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.enterprise.my(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.enterprise.all(),
            });
            toast({
                title: t("enterprise.toast.deleteSuccess"),
                description: t("enterprise.toast.deleteSuccessDescription"),
            });
        },
        onError: (error) => {
            toast({
                title: t("enterprise.toast.deleteError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("enterprise.toast.deleteErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};

export const useTransferOwnershipMutation = (): MutationResult<
    ITransferOwnershipResponse,
    { id: string; data: ITransferEnterpriseOwnershipBodyRequest }
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<
        ITransferOwnershipResponse,
        Error,
        { id: string; data: ITransferEnterpriseOwnershipBodyRequest }
    >({
        mutationFn: async (payload) => {
            return await transferOwnershipAction(payload.id, payload.data);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.enterprise.my(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.enterprise.detail(response.enterprise.id),
            });
            toast({
                title: t("enterprise.toast.transferSuccess"),
                description: t("enterprise.toast.transferSuccessDescription"),
            });
        },
        onError: (error) => {
            toast({
                title: t("enterprise.toast.transferError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("enterprise.toast.transferErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};

export const useUpdateGoogleTokensMutation = (): MutationResult<
    IUpdateEnterpriseResponse,
    { id: string; data: IUpdateEnterpriseGoogleTokensBodyRequest }
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<
        IUpdateEnterpriseResponse,
        Error,
        { id: string; data: IUpdateEnterpriseGoogleTokensBodyRequest }
    >({
        mutationFn: async (payload) => {
            return await updateGoogleTokensAction(payload.id, payload.data);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.enterprise.my(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.enterprise.detail(response.id),
            });
            toast({
                title: t("enterprise.toast.tokensSuccess"),
                description: t("enterprise.toast.tokensSuccessDescription"),
            });
        },
        onError: (error) => {
            toast({
                title: t("enterprise.toast.tokensError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("enterprise.toast.tokensErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};
