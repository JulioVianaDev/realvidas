export type ResetPasswordLocale = "en-US" | "pt-BR";

export const resetPasswordMessages: Record<
    ResetPasswordLocale,
    {
        preview: string;
        heading: string;
        greeting: string;
        defaultUserName: string;
        intro: string;
        button: string;
        ignore: string;
    }
> = {
    "en-US": {
        preview: "Reset your password",
        heading: "Reset your password",
        greeting: "Hi",
        defaultUserName: "there",
        intro:
            "we received a request to reset your password. Click the button below to choose a new password. This link will expire shortly for your security.",
        button: "Reset password",
        ignore:
            "If you didn't request a password reset, you can safely ignore this email.",
    },
    "pt-BR": {
        preview: "Redefina sua senha",
        heading: "Redefina sua senha",
        greeting: "Olá",
        defaultUserName: "usuário",
        intro:
            "recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para escolher uma nova senha. Este link expira em breve por segurança.",
        button: "Redefinir senha",
        ignore:
            "Se você não solicitou a redefinição de senha, pode ignorar este e-mail.",
    },
};

const defaultLocale: ResetPasswordLocale = "en-US";

export function getResetPasswordMessages(
    locale?: ResetPasswordLocale | string | null,
) {
    const key =
        locale && locale in resetPasswordMessages
            ? (locale as ResetPasswordLocale)
            : defaultLocale;
    return resetPasswordMessages[key];
}
