export const GOOGLE_OAUTH_CALLBACK_PATH = "/auth/google/callback";
const GOOGLE_OAUTH_RETURN_KEY = "google-oauth-return-to";

export function getGoogleOAuthRedirectUri(): string {
    const configured = import.meta.env.VITE_GOOGLE_REDIRECT_URI as
        | string
        | undefined;
    if (configured?.trim()) {
        return configured.trim().replace(/\/$/, "");
    }

    return `${window.location.origin}${GOOGLE_OAUTH_CALLBACK_PATH}`;
}

export function startGoogleOAuthRedirect(): void {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
    if (!clientId?.trim()) {
        throw new Error("VITE_GOOGLE_CLIENT_ID is not configured");
    }

    const redirectUri = getGoogleOAuthRedirectUri();
    const params = new URLSearchParams({
        client_id: clientId.trim(),
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        access_type: "online",
        prompt: "select_account",
    });

    window.location.assign(
        `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    );
}

export function saveGoogleOAuthReturnPath(): void {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || "/inicio";
    sessionStorage.setItem(GOOGLE_OAUTH_RETURN_KEY, redirect);
}

export function consumeGoogleOAuthReturnPath(): string {
    const redirect =
        sessionStorage.getItem(GOOGLE_OAUTH_RETURN_KEY) || "/inicio";
    sessionStorage.removeItem(GOOGLE_OAUTH_RETURN_KEY);
    return redirect;
}
