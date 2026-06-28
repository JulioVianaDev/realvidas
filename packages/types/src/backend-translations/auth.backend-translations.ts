export type BackendAuthLocale = "en-US" | "pt-BR";

export type AuthBackendMessageKey =
  | "AUTH_LOGIN_USER_NOT_FOUND"
  | "AUTH_LOGIN_INVALID_PASSWORD"
  | "AUTH_GOOGLE_NO_ID_TOKEN"
  | "AUTH_GOOGLE_INVALID_PAYLOAD"
  | "AUTH_GOOGLE_NO_EMAIL"
  | "AUTH_GOOGLE_USER_CREATE_FAILED"
  | "AUTH_GOOGLE_FAILED"
  | "AUTH_REGISTER_EMAIL_IN_USE"
  | "AUTH_REGISTER_FAILED"
  | "AUTH_VERIFY_CODE_INVALID_OR_EXPIRED"
  | "AUTH_CONFIRM_LINK_INVALID_OR_EXPIRED"
  | "AUTH_CONFIRM_LINK_INVALID"
  | "AUTH_USER_NOT_FOUND"
  | "AUTH_EMAIL_ALREADY_VERIFIED"
  | "AUTH_RESEND_CODE_SENT"
  | "AUTH_TOKEN_INVALID";

export const AUTH_BACKEND_MESSAGES: Record<
  AuthBackendMessageKey,
  Record<BackendAuthLocale, string>
> = {
  AUTH_LOGIN_USER_NOT_FOUND: {
    "en-US": "No account found with this email.",
    "pt-BR": "Nenhuma conta encontrada com este e-mail.",
  },
  AUTH_LOGIN_INVALID_PASSWORD: {
    "en-US": "Incorrect password.",
    "pt-BR": "Senha incorreta.",
  },
  AUTH_GOOGLE_NO_ID_TOKEN: {
    "en-US": "Could not retrieve an ID token from Google.",
    "pt-BR": "Não foi possível obter o token de identificação do Google.",
  },
  AUTH_GOOGLE_INVALID_PAYLOAD: {
    "en-US": "Invalid Google token.",
    "pt-BR": "Token do Google inválido.",
  },
  AUTH_GOOGLE_NO_EMAIL: {
    "en-US": "Google did not provide an email address.",
    "pt-BR": "O Google não forneceu um endereço de e-mail.",
  },
  AUTH_GOOGLE_USER_CREATE_FAILED: {
    "en-US": "Could not create your account. Please try again.",
    "pt-BR": "Não foi possível criar sua conta. Tente novamente.",
  },
  AUTH_GOOGLE_FAILED: {
    "en-US": "Google sign-in failed. Please try again.",
    "pt-BR": "Falha no login com o Google. Tente novamente.",
  },
  AUTH_REGISTER_EMAIL_IN_USE: {
    "en-US": "This email is already registered.",
    "pt-BR": "Este e-mail já está cadastrado.",
  },
  AUTH_REGISTER_FAILED: {
    "en-US": "Registration could not be completed. Please try again.",
    "pt-BR": "Não foi possível concluir o cadastro. Tente novamente.",
  },
  AUTH_VERIFY_CODE_INVALID_OR_EXPIRED: {
    "en-US": "Invalid or expired verification code.",
    "pt-BR": "Código inválido ou expirado.",
  },
  AUTH_CONFIRM_LINK_INVALID_OR_EXPIRED: {
    "en-US": "This link is invalid or has expired.",
    "pt-BR": "Este link é inválido ou expirou.",
  },
  AUTH_CONFIRM_LINK_INVALID: {
    "en-US": "Invalid link.",
    "pt-BR": "Link inválido.",
  },
  AUTH_USER_NOT_FOUND: {
    "en-US": "User not found.",
    "pt-BR": "Usuário não encontrado.",
  },
  AUTH_EMAIL_ALREADY_VERIFIED: {
    "en-US": "This email is already verified.",
    "pt-BR": "Este e-mail já foi verificado.",
  },
  AUTH_RESEND_CODE_SENT: {
    "en-US": "Verification code sent.",
    "pt-BR": "Código de verificação enviado.",
  },
  AUTH_TOKEN_INVALID: {
    "en-US": "Invalid or expired session.",
    "pt-BR": "Sessão inválida ou expirada.",
  },
};

export function normalizeBackendAuthLocale(
  input?: string | null,
): BackendAuthLocale {
  return input === "pt-BR" ? "pt-BR" : "en-US";
}

export function getAuthBackendMessage(
  key: AuthBackendMessageKey,
  locale: BackendAuthLocale,
): string {
  return AUTH_BACKEND_MESSAGES[key][locale];
}
