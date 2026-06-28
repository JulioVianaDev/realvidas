/** Format stored cents as BRL display string for inputs. */
export function centsToMoneyInput(
    cents: number,
    locale: "pt-BR" | "en-US" = "pt-BR",
): string {
    if (!cents) return "";
    const value = cents / 100;
    return locale === "pt-BR"
        ? value.toFixed(2).replace(".", ",")
        : value.toFixed(2);
}

/** Parse user-typed money (e.g. 29,12 or 29.12) to integer cents. */
export function parseMoneyInputToCents(
    raw: string,
    locale: "pt-BR" | "en-US" = "pt-BR",
): number {
    const trimmed = raw.trim();
    if (!trimmed) return 0;

    let normalized = trimmed.replace(/[^\d,.-]/g, "");
    if (locale === "pt-BR") {
        normalized = normalized.replace(/\./g, "").replace(",", ".");
    } else {
        normalized = normalized.replace(/,/g, "");
    }

    const value = Number.parseFloat(normalized);
    if (Number.isNaN(value) || value < 0) return 0;
    return Math.round(value * 100);
}

export function formatPrice(cents: number): string {
    return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

export function effectivePrice(
    price: number,
    discountPercent?: number | null,
): number {
    if (!discountPercent) return price;
    return Math.round(price - (price * discountPercent) / 100);
}

export function moneyInputPlaceholder(locale: "pt-BR" | "en-US"): string {
    return locale === "pt-BR" ? "0,00" : "0.00";
}
