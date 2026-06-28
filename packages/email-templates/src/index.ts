export { DEFAULT_APP_BASE_URL } from "./constants";
export {
    LoginAuthCodeEmail,
    type LoginAuthCodeEmailProps,
    type LoginCodeTheme,
} from "./templates/login-code/login-code";
export {
    loginCodeMessages,
    getLoginCodeMessages,
    type LoginCodeLocale,
} from "./templates/login-code/login-code.message";
export {
    ResetPasswordEmail,
    type ResetPasswordEmailProps,
    type ResetPasswordTheme,
} from "./templates/reset-password/reset-password.email";
export {
    resetPasswordMessages,
    getResetPasswordMessages,
    type ResetPasswordLocale,
} from "./templates/reset-password/reset-password.messages";
export { renderLoginCodeEmail, renderResetPasswordEmail } from "./render";
export { emailColors, emailFonts, type EmailColorKey } from "./theme";
export { Header, type HeaderProps } from "./components/Header";
export { Footer, type FooterProps } from "./components/Footer";
export {
    getHeaderFooterMessages,
    headerFooterMessages,
    type HeaderFooterLocale,
} from "./components/header-footer.messages";
