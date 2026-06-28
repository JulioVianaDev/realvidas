import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGoogleLoginMutation } from "@/hooks/query/auth/auth.query";
import { getAuthApiErrorMessage } from "@/utils/auth-api-error";
import { useTranslation } from "@/contexts/TranslationsContext";
import {
    consumeGoogleOAuthReturnPath,
    getGoogleOAuthRedirectUri,
} from "@/lib/google-oauth";

export const Route = createFileRoute("/_public/auth/google/callback/")({
    component: GoogleOAuthCallbackPage,
});

function GoogleOAuthCallbackPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const googleLoginMutation = useGoogleLoginMutation();
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        const params = new URLSearchParams(window.location.search);
        const oauthError = params.get("error");

        if (oauthError) {
            toast.error(t("auth.google.errorGooglePopup"));
            navigate({ to: "/login", replace: true });
            return;
        }

        const code = params.get("code");
        if (!code) {
            navigate({ to: "/login", replace: true });
            return;
        }

        const returnTo = consumeGoogleOAuthReturnPath();

        googleLoginMutation.mutate(
            {
                code,
                redirectUri: getGoogleOAuthRedirectUri(),
            },
            {
                onSuccess: (data) => {
                    toast.success(t("auth.google.successToast"));
                    if (data.emailConfirmed === false) {
                        navigate({
                            to: "/verify-email",
                            search: { redirect: returnTo },
                            replace: true,
                        });
                        return;
                    }
                    navigate({ to: returnTo, replace: true });
                },
                onError: (error: unknown) => {
                    toast.error(
                        getAuthApiErrorMessage(
                            error,
                            t("auth.google.errorServerFallback"),
                        ),
                    );
                    navigate({ to: "/login", replace: true });
                },
            },
        );
    }, [googleLoginMutation, navigate, t]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>{t("auth.google.submitting")}</p>
            </div>
        </div>
    );
}
