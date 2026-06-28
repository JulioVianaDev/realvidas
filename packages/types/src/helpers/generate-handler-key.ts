export type HandlerKeyPrefix = "custom" | "mocked";

/**
 * Builds a camelCase slug from a human-readable label (no prefix).
 * Accents are stripped ("maças" → "macas"), then words are joined in camelCase.
 *
 * @example generateFunctionNameFromLabel("Generate payment for the user") → "generatePaymentForTheUser"
 * @example generateFunctionNameFromLabel("Criar usuário") → "criarUsuario"
 */
export function generateFunctionNameFromLabel(label: string): string {
    const normalized = label
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9\s]/g, " ")
        .trim();

    const words = normalized.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
        return "tool";
    }

    const camel = words
        .map((word, index) => {
            const lower = word.toLowerCase();
            if (index === 0) {
                return lower;
            }
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join("");

    return /^[a-zA-Z]/.test(camel)
        ? camel
        : `tool${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
}

/** Strips the `mocked:` / `custom:` prefix from a handler key. */
export function functionNameFromHandlerKey(handlerKey: string): string {
    const idx = handlerKey.indexOf(":");
    if (idx === -1) return handlerKey;
    const slug = handlerKey.slice(idx + 1);
    return slug || "tool";
}

/**
 * Builds a handler key from a human-readable name.
 *
 * @example generateHandlerKeyFromName("chamar meu cliente") → "custom:chamarMeuCliente"
 */
export function generateHandlerKeyFromName(
    name: string,
    prefix: HandlerKeyPrefix = "custom",
): string {
    return `${prefix}:${generateFunctionNameFromLabel(name)}`;
}
