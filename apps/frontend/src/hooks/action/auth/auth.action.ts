import { API_ROUTES } from "@/api";
import api from "@/axios/axios.v1";
import {
    IAuthLoginResponse,
    IRegisterResponse,
} from "@global-types/responses/auth.response";
import { CreateUserBodyRequest } from "@global-types/body-requests/user.body-request";
import {
    IConfirmEmailLinkBodyRequest,
    ILoginBodyRequest,
    IResendVerificationCodeBodyRequest,
    IResendVerificationFromLinkBodyRequest,
    IVerifyRegistrationCodeBodyRequest,
} from "@global-types/body-requests/auth.body-request";
import {
    IResendVerificationResponse,
    IVerificationLinkContextResponse,
} from "@global-types/responses/auth.response";

export const googleLoginAction = async (payload: {
    code: string;
    redirectUri?: string;
}): Promise<IAuthLoginResponse> => {
    const data = await api.post<IAuthLoginResponse>(
        API_ROUTES.AUTH.GOOGLE,
        {
            token: payload.code,
            redirectUri: payload.redirectUri,
        },
    );
    return data;
};

export const loginAction = async (
    payload: ILoginBodyRequest,
): Promise<IAuthLoginResponse> => {
    const data = await api.post<IAuthLoginResponse>(
        API_ROUTES.AUTH.LOGIN,
        payload,
    );
    return data;
};

export const registerAction = async (
    payload: CreateUserBodyRequest,
): Promise<IRegisterResponse> => {
    const data = await api.post<IRegisterResponse>(
        API_ROUTES.AUTH.REGISTER,
        payload,
    );
    return data;
};

export const verifyRegistrationCodeAction = async (
    payload: IVerifyRegistrationCodeBodyRequest,
): Promise<IAuthLoginResponse> => {
    const data = await api.post<IAuthLoginResponse>(
        API_ROUTES.AUTH.REGISTER_VERIFY_CODE,
        payload,
    );
    return data;
};

export const confirmEmailFromLinkAction = async (
    payload: IConfirmEmailLinkBodyRequest,
): Promise<IAuthLoginResponse> => {
    const data = await api.post<IAuthLoginResponse>(
        API_ROUTES.AUTH.REGISTER_CONFIRM_EMAIL,
        payload,
    );
    return data;
};

export const resendVerificationCodeAction = async (
    payload: IResendVerificationCodeBodyRequest,
): Promise<IResendVerificationResponse> => {
    const data = await api.post<IResendVerificationResponse>(
        API_ROUTES.AUTH.REGISTER_RESEND_CODE,
        payload,
    );
    return data;
};

export const resendVerificationFromLinkAction = async (
    payload: IResendVerificationFromLinkBodyRequest,
): Promise<IResendVerificationResponse> => {
    const data = await api.post<IResendVerificationResponse>(
        API_ROUTES.AUTH.REGISTER_RESEND_FROM_LINK,
        payload,
    );
    return data;
};

export const verificationLinkContextAction = async (
    payload: IConfirmEmailLinkBodyRequest,
): Promise<IVerificationLinkContextResponse> => {
    const data = await api.post<IVerificationLinkContextResponse>(
        API_ROUTES.AUTH.REGISTER_LINK_CONTEXT,
        payload,
    );
    return data;
};