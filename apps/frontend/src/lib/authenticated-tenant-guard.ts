/** Paths allowed for users without a tenant (setup / seller / company flows). */
export function isPathAllowedWithoutTenant(pathname: string): boolean {
    const path = pathname.replace(/\/+$/, "") || "/";
    if (path === "/inicio") {
        return true;
    }
    return path.startsWith("/seller") || path.startsWith("/enterprise");
}
