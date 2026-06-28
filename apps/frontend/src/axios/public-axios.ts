import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

type ExtractedAxiosInstance = Omit<
    AxiosInstance,
    "get" | "post" | "put" | "patch" | "delete"
> & {
    get<T = any, R = T>(
        ...args: Parameters<AxiosInstance["get"]>
    ): Promise<R>;
    post<T = any, R = T>(
        ...args: Parameters<AxiosInstance["post"]>
    ): Promise<R>;
    put<T = any, R = T>(
        ...args: Parameters<AxiosInstance["put"]>
    ): Promise<R>;
    patch<T = any, R = T>(
        ...args: Parameters<AxiosInstance["patch"]>
    ): Promise<R>;
    delete<T = any, R = T>(
        ...args: Parameters<AxiosInstance["delete"]>
    ): Promise<R>;
};

const raw = axios.create({
    baseURL: import.meta.env.VITE_NESTJS_URL,
    timeout: 10000,
}) as ExtractedAxiosInstance;

raw.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error),
);

/**
 * Public requests carry `tenantId` explicitly from the URL path so the server
 * can select the right tenant schema without a JWT. The frontend always sends
 * both tenantId and enterpriseId via the URL params — no lookup required.
 */
function withTenant(
    tenantId: string,
    cfg: AxiosRequestConfig = {},
): AxiosRequestConfig {
    return {
        ...cfg,
        headers: { ...(cfg.headers ?? {}), "x-tenant-id": tenantId },
    };
}

export const publicApi = {
    get<T>(
        tenantId: string,
        url: string,
        cfg?: AxiosRequestConfig,
    ): Promise<T> {
        return raw.get<T>(url, withTenant(tenantId, cfg));
    },
    post<T>(
        tenantId: string,
        url: string,
        data?: unknown,
        cfg?: AxiosRequestConfig,
    ): Promise<T> {
        return raw.post<T>(url, data, withTenant(tenantId, cfg));
    },
};
