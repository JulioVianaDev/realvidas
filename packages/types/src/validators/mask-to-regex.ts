/** Convert a display-mask (e.g. `000.000.000-00`, `AAA-0000`) into an anchored regex. */
export function maskToRegex(mask: string): RegExp {
    const p = mask
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\d/g, "\\d")
        .replace(/[a-zA-Z]/g, "[a-zA-Z]");
    return new RegExp(`^${p}$`);
}
