/** Min/max chars for a public short path. */
export const SHORT_PATH_MIN_LENGTH = 5 as const;
export const SHORT_PATH_MAX_LENGTH = 40 as const;

/** Reserved segments that cannot be used as a short path (collision with app routes). */
export const RESERVED_SHORT_PATHS: readonly string[] = [
    "s",
    "public",
    "_public",
    "admin",
    "api",
    "auth",
    "login",
    "logout",
    "register",
    "verify-email",
    "welcome",
    "static",
    "assets",
    "enterprises",
    "enterprise",
    "users",
    "user",
    "catalog",
    "cart",
    "orders",
    "offerings",
    "plans",
];

/**
 * Validation rule for a short path, shared between frontend and backend.
 * - lowercase
 * - alphanumeric segments separated by single hyphens
 * - no leading/trailing hyphen, no double hyphens
 * - length within [SHORT_PATH_MIN_LENGTH, SHORT_PATH_MAX_LENGTH]
 */
export const SHORT_PATH_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export interface IUrlShortenerEntity {
    id: string;
    path: string;
    tenantId: string;
    enterpriseId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface IResolvedShortPath {
    path: string;
    tenantId: string;
    enterpriseId: string;
}

export interface IShortPathAvailabilityResponse {
    available: boolean;
    /** Reason if unavailable: 'taken' | 'reserved' | 'invalid'. */
    reason?: "taken" | "reserved" | "invalid";
}
