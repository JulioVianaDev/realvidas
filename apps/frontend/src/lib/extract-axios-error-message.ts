import { AxiosError } from "axios";

/**
 * NestJS HttpException body often uses `{ message: string | string[] }`.
 * Backend strings are already localized when using BackendTranslatorService.
 */
export function extractAxiosErrorMessage(
    error: unknown,
    fallback: string,
): string {
    if (error && typeof error === "object" && "response" in error) {
        const ax = error as AxiosError<{ message?: string | string[] }>;
        const msg = ax.response?.data?.message;
        if (typeof msg === "string" && msg.trim()) {
            return msg.trim();
        }
        if (Array.isArray(msg) && msg.length > 0) {
            const joined = msg.filter(Boolean).join(" ");
            if (joined.trim()) return joined.trim();
        }
    }
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
}
