import {
    createUsers,
    createUsersByFile,
    deleteUsers,
    getUsers,
    patchMyCurrentTenant,
    patchMyUiPreferences,
    updateUsers,
} from "@/hooks/action/user/user";
import { useQuery } from "@tanstack/react-query";
import { Exact } from "@global-types/helpers/exact";
import { GetUsersParams } from "@global-types/params/user.params";
import {
    GetUsersResponse,
    GetUserByIdResponse,
    UpdateOrCreateUserResponse,
    IPatchUserUiPreferencesResponse,
} from "@global-types/responses/user.response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    CreateUserBodyRequest,
    IPatchMyCurrentTenantBodyRequest,
    IPatchUserUiPreferencesBodyRequest,
    UpdateUserBodyRequest,
} from "@global-types/body-requests/user.body-request";
import useQueryParams from "@/hooks/useQueryparams";
import { RoleType } from "@global-types/entities/user.entity-type";
import { getUserById } from "../../action/user/user";
import { useUserStore } from "../../../zustand/user.store";
import { useToast } from "@/components/ui/use-toast";
import { resetPassword } from "@/hooks/action/user/user";
import { queryKeys } from "../query-keys";
import type { MutationResult, QueryResult } from "../query-result.types";

export const useUsersQuery = (
    params: Exact<GetUsersParams, GetUsersParams>,
): QueryResult<GetUsersResponse> => {
    return useQuery<GetUsersResponse>({
        queryKey: queryKeys.user.list(params),
        queryFn: async () => {
            return await getUsers(params);
        },
        refetchOnWindowFocus: false,
        initialData: {
            data: [],
            metadata: {
                page: params.page ?? 0,
                search: params.search ?? "",
                hasNextPage: false,
                total: 0,
                hasPreviousPage: false,
            },
        },
    });
};
export const useGetUserById = (
    userId: string | undefined,
): QueryResult<GetUserByIdResponse> => {
    const { setUser } = useUserStore();

    return useQuery<GetUserByIdResponse>({
        queryKey: queryKeys.user.detail(userId ?? ""),
        queryFn: async () => {
            if (!userId) {
                return null;
            }
            const user = await getUserById(userId);
            setUser(user);
            return user;
        },
        enabled: !!userId,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 60_000,
    });
};

export const useDeleteUser = (): MutationResult<string, string> => {
    const queryClient = useQueryClient();
    const { search: searchQuery } = useQueryParams();
    const page = Number(searchQuery.get("page") ?? 1);
    const search = searchQuery.get("search") ?? "";
    const role = (searchQuery.get("role") as RoleType) ?? "ALL";
    return useMutation<string, Error, string>({
        mutationFn: async (userId: string) => {
            await deleteUsers(userId);
            return userId;
        },
        onSuccess: (userId) => {
            queryClient.setQueryData(
                queryKeys.user.list({ page, search, role }),
                (oldData: GetUsersResponse | undefined) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.filter(
                            (user) => user.id !== userId,
                        ),
                    };
                },
            );
        },
    });
};

export const useUpdateUser = (): MutationResult<
    UpdateOrCreateUserResponse,
    { data: UpdateUserBodyRequest; userId: string }
> => {
    const queryClient = useQueryClient();
    const { search: searchQuery } = useQueryParams();
    const page = Number(searchQuery.get("page") ?? 1);
    const search = searchQuery.get("search") ?? "";
    return useMutation<
        UpdateOrCreateUserResponse,
        Error,
        { data: UpdateUserBodyRequest; userId: string }
    >({
        mutationFn: async (payload: {
            data: UpdateUserBodyRequest;
            userId: string;
        }) => {
            return await updateUsers(payload);
        },
        onSuccess: (response) => {
            queryClient.setQueryData(
                queryKeys.user.list({ page, search, role: response.role }),
                (oldData: GetUsersResponse | undefined) => {
                    if (!oldData) return undefined;
                    return {
                        ...oldData,
                        data: oldData.data.map((d) => {
                            if (d.id === response.id) {
                                return response;
                            }
                            return d;
                        }),
                    };
                },
            );
        },
    });
};
export const useCreateUser = (): MutationResult<
    UpdateOrCreateUserResponse,
    { data: CreateUserBodyRequest }
> => {
    const queryClient = useQueryClient();
    const { search: searchQuery } = useQueryParams();
    const page = Number(searchQuery.get("page") ?? 1);
    const search = searchQuery.get("search") ?? "";
    return useMutation<
        UpdateOrCreateUserResponse,
        Error,
        { data: CreateUserBodyRequest }
    >({
        mutationFn: async (payload: {
            data: CreateUserBodyRequest;
        }) => {
            return await createUsers(payload);
        },
        onSuccess: (response) => {
            queryClient.setQueryData(
                queryKeys.user.list({ page, search, role: response.role }),
                (oldData: GetUsersResponse | undefined) => {
                    if (!oldData) return undefined;
                    return {
                        ...oldData,
                        data: [response, ...oldData.data],
                        metadata: {
                            ...oldData.metadata,
                            total: oldData.metadata.total + 1,
                        },
                    };
                },
            );
        },
    });
};
export const useSubmitCreateUsersByFile = (): MutationResult<
    boolean,
    { file: File }
> => {
    const queryClient = useQueryClient();

    return useMutation<boolean, Error, { file: File }>({
        mutationFn: async (payload: { file: File }) => {
            return await createUsersByFile(payload.file);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.user.all(),
            });
        },
    });
};

export const useResetPassword = (): MutationResult<
    UpdateOrCreateUserResponse,
    string
> => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation<UpdateOrCreateUserResponse, Error, string>({
        mutationFn: async (userId: string) => {
            return await resetPassword(userId);
        },
        onSuccess: () => {
            toast({
                title: "Senha redefinida com sucesso!",
                description: "A senha foi alterada para 'mynds'",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao redefinir senha!",
                description:
                    "Ocorreu um erro ao tentar redefinir a senha",
                variant: "destructive",
            });
        },
    });
};

export const usePatchMyCurrentTenantMutation = (): MutationResult<
    GetUserByIdResponse,
    IPatchMyCurrentTenantBodyRequest
> => {
    const queryClient = useQueryClient();
    const { setUser } = useUserStore();

    return useMutation<
        GetUserByIdResponse,
        Error,
        IPatchMyCurrentTenantBodyRequest
    >({
        mutationFn: async (payload: IPatchMyCurrentTenantBodyRequest) => {
            return patchMyCurrentTenant(payload);
        },
        onSuccess: (user) => {
            setUser(user);
            queryClient.invalidateQueries({
                queryKey: queryKeys.user.all(),
            });
        },
    });
};

export const useSetUserTenantCache = () => {
    const queryClient = useQueryClient();
    const { setUser, user } = useUserStore();

    return (userId: string, tenantId: string) => {
        queryClient.setQueryData<GetUserByIdResponse>(
            queryKeys.user.detail(userId),
            (old) => {
                if (!old) return old;
                return {
                    ...old,
                    currentTenantViewId: tenantId,
                    hasTenantMembership: true,
                };
            },
        );
        if (user) {
            setUser({
                ...user,
                currentTenantViewId: tenantId,
                hasTenantMembership: true,
            });
        }
    };
};

export function ensureUserByIdQueryConfig(userId: string) {
    return {
        queryKey: queryKeys.user.detail(userId),
        queryFn: () => getUserById(userId),
        staleTime: 60_000,
    };
}

export const usePatchMyUiPreferencesMutation = (): MutationResult<
    IPatchUserUiPreferencesResponse,
    IPatchUserUiPreferencesBodyRequest
> => {
    return useMutation<
        IPatchUserUiPreferencesResponse,
        Error,
        IPatchUserUiPreferencesBodyRequest
    >({
        mutationFn: async (payload: IPatchUserUiPreferencesBodyRequest) => {
            return patchMyUiPreferences(payload);
        },
    });
};
