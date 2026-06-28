import * as React from "react";
import { render } from "@react-email/render";
import { LoginAuthCodeEmail } from "./templates/login-code/login-code";
import type { LoginAuthCodeEmailProps } from "./templates/login-code/login-code";
import { ResetPasswordEmail } from "./templates/reset-password/reset-password.email";
import type { ResetPasswordEmailProps } from "./templates/reset-password/reset-password.email";

/**
 * Renders the login-code email to HTML with the given params.
 * Called by the backend to get HTML without running React in the backend.
 */
export async function renderLoginCodeEmail(
    props: LoginAuthCodeEmailProps,
): Promise<string> {
    return render(React.createElement(LoginAuthCodeEmail, props));
}

/**
 * Renders the reset-password email to HTML with the given params.
 * Called by the backend to get HTML without running React in the backend.
 */
export async function renderResetPasswordEmail(
    props: ResetPasswordEmailProps,
): Promise<string> {
    return render(React.createElement(ResetPasswordEmail, props));
}
