/**
 * Paths allowed when the user has no tenant (setup: inicio, seller, enterprise).
 * All other authenticated routes redirect to /inicio until a tenant exists.
 */
export function isNoTenantAllowedPath(pathname: string): boolean {
    const normalized = pathname.replace(/\/$/, "") || "/";
    const allowedPrefixes = [
        "/inicio",
        "/seller",
        "/enterprise",
        "/admin",
    ] as const;
    return allowedPrefixes.some(
        (p) => normalized === p || normalized.startsWith(`${p}/`),
    );
}
