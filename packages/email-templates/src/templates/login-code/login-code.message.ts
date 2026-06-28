export type LoginCodeLocale = "en-US" | "pt-BR";

export const loginCodeMessages: Record<
    LoginCodeLocale,
    {
        preview: string;
        heading: string;
        button: string;
        bodyText: string;
        continueLink: string;
        logoAlt: string;
    }
> = {
    "en-US": {
        preview: "Your login code",
        heading: "Your login code",
        button: "Log in",
        bodyText:
            "This link and code will only be valid for the next 5 minutes. If the link does not work, you can use the login verification code directly:",
        continueLink: "Continue",
        logoAlt: "Logo",
    },
    "pt-BR": {
        preview: "Seu código de login",
        heading: "Seu código de login",
        button: "Entrar",
        bodyText:
            "Este link e código serão válidos apenas pelos próximos 5 minutos. Se o link não funcionar, você pode usar o código de verificação de login diretamente:",
        continueLink: "Continuar",
        logoAlt: "Logo",
    },
};

const defaultLocale: LoginCodeLocale = "en-US";

export function getLoginCodeMessages(
    locale?: LoginCodeLocale | string | null,
) {
    const key =
        locale && locale in loginCodeMessages
            ? (locale as LoginCodeLocale)
            : defaultLocale;
    return loginCodeMessages[key];
}
