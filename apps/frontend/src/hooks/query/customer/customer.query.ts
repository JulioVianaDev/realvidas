import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { Exact } from "@global-types/helpers/exact";
import { IGetAllCustomersParams } from "@global-types/params/customer.params";
import {
    ICreateCustomerBodyRequest,
    IUpdateCustomerBodyRequest,
} from "@global-types/body-requests/customer.body-request";
import {
    IGetAllCustomersResponse,
    IGetCustomerByIdResponse,
    ICreateCustomerResponse,
    IUpdateCustomerResponse,
    IDeleteCustomerResponse,
} from "@global-types/responses/customer.response";
import {
    getCustomersAction,
    getCustomerByIdAction,
    createCustomerAction,
    updateCustomerAction,
    deleteCustomerAction,
} from "@/hooks/action/customer/customer.action";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/contexts/TranslationsContext";
import { extractAxiosErrorMessage } from "@/lib/extract-axios-error-message";
import { queryKeys } from "../query-keys";
import type {
    QueryResult,
    MutationResult,
} from "../query-result.types";

export const useGetCustomersQuery = (
    params: Exact<IGetAllCustomersParams, IGetAllCustomersParams>,
    enabled = true,
): QueryResult<IGetAllCustomersResponse> => {
    return useQuery<IGetAllCustomersResponse>({
        queryKey: queryKeys.customer.list(params),
        queryFn: async () => await getCustomersAction(params),
        enabled,
        refetchOnMount: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });
};

export const useGetCustomerByIdQuery = (
    id: string | null | undefined,
): QueryResult<IGetCustomerByIdResponse> => {
    return useQuery<IGetCustomerByIdResponse>({
        queryKey: queryKeys.customer.detail(id || ""),
        queryFn: async () => await getCustomerByIdAction(id as string),
        enabled: !!id,
        refetchOnMount: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });
};

export const useCreateCustomerMutation = (): MutationResult<
    ICreateCustomerResponse,
    ICreateCustomerBodyRequest
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<
        ICreateCustomerResponse,
        Error,
        ICreateCustomerBodyRequest
    >({
        mutationFn: async (payload) =>
            await createCustomerAction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.customer.all(),
            });
            toast({ title: t("customer.toast.createSuccess") });
        },
        onError: (error) => {
            toast({
                title: t("customer.toast.createError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("customer.toast.createErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};

export const useUpdateCustomerMutation = (): MutationResult<
    IUpdateCustomerResponse,
    { id: string; payload: IUpdateCustomerBodyRequest }
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<
        IUpdateCustomerResponse,
        Error,
        { id: string; payload: IUpdateCustomerBodyRequest }
    >({
        mutationFn: async ({ id, payload }) =>
            await updateCustomerAction(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.customer.all(),
            });
            toast({ title: t("customer.toast.updateSuccess") });
        },
        onError: (error) => {
            toast({
                title: t("customer.toast.updateError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("customer.toast.updateErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};

export const useDeleteCustomerMutation = (): MutationResult<
    IDeleteCustomerResponse,
    string
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<IDeleteCustomerResponse, Error, string>({
        mutationFn: async (id) => await deleteCustomerAction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.customer.all(),
            });
            toast({ title: t("customer.toast.deleteSuccess") });
        },
        onError: (error) => {
            toast({
                title: t("customer.toast.deleteError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("customer.toast.deleteErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};
