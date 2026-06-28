/** Path segment for the public store catalog (no origin). */
export function getPublicCatalogPath(shortPath: string): string {
    return `/s/${shortPath}/catalog`;
}

/** Full URL for sharing the public catalog. */
export function getPublicCatalogUrl(shortPath: string): string {
    if (typeof window !== "undefined") {
        return `${window.location.origin}${getPublicCatalogPath(shortPath)}`;
    }
    return getPublicCatalogPath(shortPath);
}
