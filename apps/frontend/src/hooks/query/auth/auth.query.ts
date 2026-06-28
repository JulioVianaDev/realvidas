import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
    loginAction,
    registerAction,
    googleLoginAction,
    verifyRegistrationCodeAction,
    resendVerificationCodeAction,
    confirmEmailFromLinkAction,
    resendVerificationFromLinkAction,
    verificationLinkContextAction,
} from "@/hooks/action/auth/auth.action";
import { useUserStore } from "@/zustand/user.store";
import { socket, useSocketV1 } from "@/api/socket";
import {
    ILoginBodyRequest,
    IVerifyRegistrationCodeBodyRequest,
    IConfirmEmailLinkBodyRequest,
    IResendVerificationFromLinkBodyRequest,
} from "@global-types/body-requests/auth.body-request";
import { queryKeys } from "../query-keys";
import { CreateUserBodyRequest } from "@global-types/body-requests/user.body-request";
import {
    IAuthLoginResponse,
    IRegisterResponse,
    IResendVerificationResponse,
    IVerificationLinkContextResponse,
} from "@global-types/responses/auth.response";
import { GetUserByIdResponse } from "@global-types/responses/user.response";
import type { MutationResult } from "../query-result.types";

const PANEL_PATH = "/inicio";

function getRedirectPath(): string {
    if (typeof window === "undefined") return PANEL_PATH;
    const params = new URLSearchParams(window.location.search);
    return params.get("redirect") || PANEL_PATH;
}

function applyAuthPayload(data: IAuthLoginResponse) {
    return {
        id: data.id,
        token: data.token,
        role: data.role,
        email: data.email,
        emailConfirmed: data.emailConfirmed,
    };
}

export function useLoginMutation(): MutationResult<
    IAuthLoginResponse,
    ILoginBodyRequest
> {
    const navigate = useNavigate();
    const setUserAuth = useUserStore((s) => s.setUserAuth);

    return useMutation<IAuthLoginResponse, Error, ILoginBodyRequest>({
        mutationFn: (payload) => loginAction(payload),
        onSuccess: async (data: IAuthLoginResponse) => {
            setUserAuth(applyAuthPayload(data));
            if (data.emailConfirmed === false) {
                navigate({
                    to: "/verify-email",
                    search: { redirect: getRedirectPath() },
                });
                return;
            }
            navigate({ to: getRedirectPath() });
        },
    });
}

export function useRegisterMutation(): MutationResult<
    IRegisterResponse,
    CreateUserBodyRequest
> {
    return useMutation<IRegisterResponse, Error, CreateUserBodyRequest>({
        mutationFn: (payload) => registerAction(payload),
    });
}

export function useVerifyRegistrationCodeMutation(): MutationResult<
    IAuthLoginResponse,
    IVerifyRegistrationCodeBodyRequest
> {
    const navigate = useNavigate();
    const setUserAuth = useUserStore((s) => s.setUserAuth);

    return useMutation<
        IAuthLoginResponse,
        Error,
        IVerifyRegistrationCodeBodyRequest
    >({
        mutationFn: (payload) => verifyRegistrationCodeAction(payload),
        onSuccess: async (data: IAuthLoginResponse) => {
            setUserAuth(applyAuthPayload(data));
            navigate({ to: getRedirectPath() });
        },
    });
}

export function useGoogleLoginMutation(): MutationResult<
    IAuthLoginResponse,
    { code: string; redirectUri?: string }
> {
    const setUserAuth = useUserStore((s) => s.setUserAuth);

    return useMutation<
        IAuthLoginResponse,
        Error,
        { code: string; redirectUri?: string }
    >({
        mutationFn: (payload) => googleLoginAction(payload),
        onSuccess: async (data: IAuthLoginResponse) => {
            setUserAuth(applyAuthPayload(data));
        },
    });
}

export function useResendVerificationCodeMutation(): MutationResult<
    IResendVerificationResponse,
    { userId: string }
> {
    return useMutation<
        IResendVerificationResponse,
        Error,
        { userId: string }
    >({
        mutationFn: (payload) => resendVerificationCodeAction(payload),
    });
}

export function useConfirmEmailFromLinkMutation(): MutationResult<
    IAuthLoginResponse,
    IConfirmEmailLinkBodyRequest
> {
    return useMutation<IAuthLoginResponse, Error, IConfirmEmailLinkBodyRequest>({
        mutationFn: (payload) => confirmEmailFromLinkAction(payload),
    });
}

export function useResendVerificationFromLinkMutation(): MutationResult<
    IResendVerificationResponse,
    IResendVerificationFromLinkBodyRequest
> {
    return useMutation<IResendVerificationResponse, Error, IResendVerificationFromLinkBodyRequest>({
        mutationFn: (payload) => resendVerificationFromLinkAction(payload),
    });
}

export function useVerificationLinkContextMutation(): MutationResult<
    IVerificationLinkContextResponse,
    IConfirmEmailLinkBodyRequest
> {
    return useMutation<
        IVerificationLinkContextResponse,
        Error,
        IConfirmEmailLinkBodyRequest
    >({
        mutationFn: (payload) => verificationLinkContextAction(payload),
    });
}

export function useAuthTenantSocketSync() {
    const queryClient = useQueryClient();
    const userAuth = useUserStore((s) => s.userAuth);
    const user = useUserStore((s) => s.user);
    const setUser = useUserStore((s) => s.setUser);

    const applyTenantUpdate = (tenantId: string) => {
        if (!tenantId) return;

        localStorage.setItem("selected-tenant-id", tenantId);

        if (userAuth?.id) {
            queryClient.setQueryData<GetUserByIdResponse>(
                queryKeys.user.detail(userAuth.id),
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        currentTenantViewId: tenantId,
                        hasTenantMembership: true,
                    };
                },
            );
        }

        if (user) {
            setUser({
                ...user,
                currentTenantViewId: tenantId,
                hasTenantMembership: true,
            });
        }
    };

    useSocketV1(
        "tenant:ready",
        (data: { tenantId: string }) => {
            if (!data?.tenantId) return;
            applyTenantUpdate(data.tenantId);
        },
        [queryClient, setUser, userAuth?.id, user],
        "authenticated",
    );

    useSocketV1(
        "tenant:changed",
        (data: { tenantId: string }) => {
            if (!data?.tenantId) return;
            applyTenantUpdate(data.tenantId);
            socket.joinTenantRoom(data.tenantId);
        },
        [queryClient, setUser, userAuth?.id, user],
        "authenticated",
    );
}
