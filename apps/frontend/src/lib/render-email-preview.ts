import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server.browser";
import {
    LoginAuthCodeEmail,
    ResetPasswordEmail,
    type LoginAuthCodeEmailProps,
    type ResetPasswordEmailProps,
} from "@email-templates";

function renderEmailPreview(
    component: React.ReactElement,
): string {
    return renderToStaticMarkup(component);
}

/** Browser-safe HTML render for dev preview (no @react-email/render / Prettier). */
export function renderLoginCodeEmailPreview(
    props: LoginAuthCodeEmailProps,
): string {
    return renderEmailPreview(
        React.createElement(LoginAuthCodeEmail, props),
    );
}

export function renderResetPasswordEmailPreview(
    props: ResetPasswordEmailProps,
): string {
    return renderEmailPreview(
        React.createElement(ResetPasswordEmail, props),
    );
}
