import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { Exact } from "@global-types/helpers/exact";
import { IGetProfilesParams } from "@global-types/params/profile.params";
import {
    ICreateProfileBodyRequest,
    IUpdateProfileBodyRequest,
    IAssignUserProfilesBodyRequest,
} from "@global-types/body-requests/profile.body-request";
import {
    IGetProfilesResponse,
    ICreateProfileResponse,
    IUpdateProfileResponse,
    IDeleteProfileResponse,
    IGetUserAssignedProfilesResponse,
    IAssignUserProfilesResponse,
    IGetMyUserProfileResponse,
} from "@global-types/responses/profile.response";
import {
    getProfilesAction,
    getMyPermissionsAction,
    getUserProfilesAction,
    createProfileAction,
    updateProfileAction,
    deleteProfileAction,
    assignUserProfilesAction,
} from "@/hooks/action/profile/profile.action";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/contexts/TranslationsContext";
import { extractAxiosErrorMessage } from "@/lib/extract-axios-error-message";
import { queryKeys } from "../query-keys";
import type {
    QueryResult,
    MutationResult,
} from "../query-result.types";

export const useGetProfilesQuery = (
    params: Exact<IGetProfilesParams, IGetProfilesParams>,
    enabled = true,
): QueryResult<IGetProfilesResponse> => {
    return useQuery<IGetProfilesResponse>({
        queryKey: queryKeys.profile.list(params),
        queryFn: async () => await getProfilesAction(params),
        enabled,
        refetchOnMount: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });
};

/** Current user's effective module permissions — consumed by the sidebar. */
export const useGetMyPermissionsQuery = (
    enabled = true,
): QueryResult<IGetMyUserProfileResponse> => {
    return useQuery<IGetMyUserProfileResponse>({
        queryKey: queryKeys.profile.mine(),
        queryFn: async () => await getMyPermissionsAction(),
        enabled,
        refetchOnMount: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });
};

/** Profiles currently linked to a given user (for the vinculus editor). */
export const useGetUserProfilesQuery = (
    userId: string | null | undefined,
): QueryResult<IGetUserAssignedProfilesResponse> => {
    return useQuery<IGetUserAssignedProfilesResponse>({
        queryKey: queryKeys.profile.byUser(userId || ""),
        queryFn: async () =>
            await getUserProfilesAction(userId as string),
        enabled: !!userId,
        refetchOnMount: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });
};

export const useCreateProfileMutation = (): MutationResult<
    ICreateProfileResponse,
    ICreateProfileBodyRequest
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<
        ICreateProfileResponse,
        Error,
        ICreateProfileBodyRequest
    >({
        mutationFn: async (payload) =>
            await createProfileAction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.profile.all(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.profile.mine(),
            });
            toast({ title: t("profile.toast.saveSuccess") });
        },
        onError: (error) => {
            toast({
                title: t("profile.toast.saveError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("profile.toast.saveErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};

export const useUpdateProfileMutation = (): MutationResult<
    IUpdateProfileResponse,
    { id: string; payload: IUpdateProfileBodyRequest }
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<
        IUpdateProfileResponse,
        Error,
        { id: string; payload: IUpdateProfileBodyRequest }
    >({
        mutationFn: async ({ id, payload }) =>
            await updateProfileAction(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.profile.all(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.profile.mine(),
            });
            toast({ title: t("profile.toast.saveSuccess") });
        },
        onError: (error) => {
            toast({
                title: t("profile.toast.saveError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("profile.toast.saveErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};

export const useDeleteProfileMutation = (): MutationResult<
    IDeleteProfileResponse,
    string
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<IDeleteProfileResponse, Error, string>({
        mutationFn: async (id) => await deleteProfileAction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.profile.all(),
            });
            toast({ title: t("profile.toast.deleteSuccess") });
        },
        onError: (error) => {
            toast({
                title: t("profile.toast.deleteError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("profile.toast.deleteErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};

export const useAssignUserProfilesMutation = (): MutationResult<
    IAssignUserProfilesResponse,
    IAssignUserProfilesBodyRequest
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<
        IAssignUserProfilesResponse,
        Error,
        IAssignUserProfilesBodyRequest
    >({
        mutationFn: async (payload) =>
            await assignUserProfilesAction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.profile.all(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.profile.mine(),
            });
            toast({ title: t("profile.toast.assignSuccess") });
        },
        onError: (error) => {
            toast({
                title: t("profile.toast.assignError"),
                description: extractAxiosErrorMessage(
                    error,
                    t("profile.toast.assignErrorDescription"),
                ),
                variant: "destructive",
            });
        },
    });
};
