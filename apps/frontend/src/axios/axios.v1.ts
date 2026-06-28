import axios, { AxiosInstance } from "axios";
import { useTranslation } from "@/contexts/TranslationsContext";
import { socket } from "@/api/socket";

// Custom wrapper type
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

const api = axios.create({
    baseURL: import.meta.env.VITE_NESTJS_URL,
    timeout: 10000,
}) as ExtractedAxiosInstance;

api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem("user");

        const language = localStorage.getItem("language") as
            | "pt-BR"
            | "en-US";
        let parsedUser = {};
        try {
            parsedUser = JSON.parse(user || "{}");
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
        // @ts-ignore
        const token = parsedUser?.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        config.headers["x-language"] = language;

        const socketId = socket.instance?.id ?? socket.guestId;
        if (socketId) {
            config.headers["x-socket-id"] = socketId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const status = error.response?.status;
        const url = String(error.config?.url ?? "");
        // 401 on these routes is validation (wrong/expired code or link), not invalid session JWT
        const isRegisterVerificationFlow =
            /\/auth\/register\/(verify-code|confirm-email|resend-code|resend-from-link|link-context)/.test(
                url,
            );

        if (status === 401 && !isRegisterVerificationFlow) {
            localStorage.removeItem("user");
            void socket.signOut();
            window.location.href = "/login";
            console.log("Unauthorized, redirecting to login...");
        }

        console.error(
            "API Error:",
            error.response?.data || error.message,
        );
        return Promise.reject(error);
    },
);

export default api;
