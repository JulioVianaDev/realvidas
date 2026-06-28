/**
 * Shared translations for Header and Footer used in all email templates.
 */
export type HeaderFooterLocale = "en-US" | "pt-BR";

export const headerFooterMessages: Record<
    HeaderFooterLocale,
    {
        logoAlt: string;
        brandName: string;
        blog: string;
        policies: string;
        helpCenter: string;
        community: string;
        companyName: string;
        address: string;
        rightsReserved: string;
    }
> = {
    "en-US": {
        logoAlt: "Logo",
        brandName: "realvidas",
        blog: "Our blog",
        policies: "Policies",
        helpCenter: "Help center",
        community: "Community",
        companyName: "realvidas",
        address: "Your address here",
        rightsReserved: "All rights reserved.",
    },
    "pt-BR": {
        logoAlt: "Logo",
        brandName: "realvidas",
        blog: "Nosso blog",
        policies: "Políticas",
        helpCenter: "Central de ajuda",
        community: "Comunidade",
        companyName: "realvidas",
        address: "Seu endereço aqui",
        rightsReserved: "Todos os direitos reservados.",
    },
};

const defaultLocale: HeaderFooterLocale = "en-US";

export function getHeaderFooterMessages(
    locale?: HeaderFooterLocale | string | null,
) {
    const key =
        locale && locale in headerFooterMessages
            ? (locale as HeaderFooterLocale)
            : defaultLocale;
    return headerFooterMessages[key];
}
