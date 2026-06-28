import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Languages } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationsContext";
import { EmailPreviewFrame } from "@/components/email-preview-frame";
import {
    renderLoginCodeEmailPreview,
    renderResetPasswordEmailPreview,
} from "@/lib/render-email-preview";
import {
    DEFAULT_APP_BASE_URL,
    type LoginCodeLocale,
    type LoginCodeTheme,
    type ResetPasswordLocale,
} from "@email-templates";

export const Route = createFileRoute("/_public/emails-views/")({
    component: RouteComponent,
});

type EmailLanguage = "en-US" | "pt-BR";

function getPreviewBaseUrl(): string {
    if (typeof window !== "undefined" && window.location.origin) {
        return window.location.origin;
    }
    return DEFAULT_APP_BASE_URL;
}

function RouteComponent() {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState<EmailLanguage>("pt-BR");
    const locale: LoginCodeLocale =
        language === "pt-BR" ? "pt-BR" : "en-US";
    const resetLocale: ResetPasswordLocale = locale;
    const isDark = theme === "dark";
    const emailTheme: LoginCodeTheme = isDark ? "dark" : "light";
    const loginPreviewKey = `login-code-${locale}-${emailTheme}`;
    const resetPreviewKey = `reset-password-${resetLocale}-${emailTheme}`;

    const baseUrl = useMemo(() => getPreviewBaseUrl(), []);
    const sampleResetUrl = `${baseUrl}/reset-password?token=preview-sample-token`;
    const sampleLoginUrl = `${baseUrl}/welcome?token=preview-sample-token`;

    const renderLoginPreviewHtml = useCallback(
        () =>
            renderLoginCodeEmailPreview({
                validationCode: "123456",
                language: locale,
                theme: emailTheme,
                baseUrl,
                loginUrl: sampleLoginUrl,
            }),
        [locale, emailTheme, baseUrl, sampleLoginUrl],
    );

    const renderResetPreviewHtml = useCallback(
        () =>
            renderResetPasswordEmailPreview({
                resetUrl: sampleResetUrl,
                userName: locale === "pt-BR" ? "Maria" : "Jane",
                language: resetLocale,
                theme: emailTheme,
                baseUrl,
            }),
        [resetLocale, locale, emailTheme, sampleResetUrl, baseUrl],
    );

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold">
                    {t("emailsPreview.title")}
                </h1>
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {t("emailsPreview.theme")}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setTheme(isDark ? "light" : "dark")
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            title={
                                isDark
                                    ? t("emailsPreview.lightMode")
                                    : t("emailsPreview.darkMode")
                            }
                            aria-label={
                                isDark
                                    ? t("emailsPreview.lightMode")
                                    : t("emailsPreview.darkMode")
                            }
                        >
                            {isDark ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </button>
                        <span className="text-sm capitalize text-muted-foreground">
                            {isDark
                                ? t("emailsPreview.themeDark")
                                : t("emailsPreview.themeLight")}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {t("emailsPreview.language")}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setLanguage((lang) =>
                                    lang === "pt-BR"
                                        ? "en-US"
                                        : "pt-BR",
                                )
                            }
                            className="flex h-9 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            title={
                                language === "pt-BR"
                                    ? t(
                                          "emailsPreview.switchToEnglish",
                                      )
                                    : t(
                                          "emailsPreview.switchToPortuguese",
                                      )
                            }
                            aria-label={
                                language === "pt-BR"
                                    ? t(
                                          "emailsPreview.switchToEnglish",
                                      )
                                    : t(
                                          "emailsPreview.switchToPortuguese",
                                      )
                            }
                        >
                            {language === "pt-BR" ? "PT-BR" : "EN"}
                        </button>
                    </div>
                </div>
            </div>

            <section className="space-y-3">
                <h2 className="text-lg font-medium">
                    {t("emailsPreview.loginCode")}
                </h2>
                <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
                    <EmailPreviewFrame
                        renderKey={loginPreviewKey}
                        renderHtml={renderLoginPreviewHtml}
                        title={t("emailsPreview.loginCode")}
                    />
                </div>
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-medium">
                    {t("emailsPreview.resetPassword")}
                </h2>
                <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
                    <EmailPreviewFrame
                        renderKey={resetPreviewKey}
                        renderHtml={renderResetPreviewHtml}
                        title={t("emailsPreview.resetPassword")}
                    />
                </div>
            </section>
        </div>
    );
}
