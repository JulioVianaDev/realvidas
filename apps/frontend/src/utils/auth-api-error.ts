import { AxiosError } from "axios";

type NestErrorBody = { message?: string | string[] };

/**
 * Reads NestJS `HttpException` message from axios errors (or `error.message`).
 */
export function getAuthApiErrorMessage(
    error: unknown,
    fallback: string,
): string {
    if (error && typeof error === "object" && "response" in error) {
        const ax = error as AxiosError<NestErrorBody>;
        const msg = ax.response?.data?.message;
        if (typeof msg === "string" && msg.trim()) {
            return msg;
        }
        if (Array.isArray(msg) && msg.length) {
            return msg.join(", ");
        }
    }
    if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as Error).message === "string"
    ) {
        const m = (error as Error).message;
        if (m && m !== "Network Error") {
            return m;
        }
    }
    return fallback;
}
