import type { BackendAuthLocale } from "./auth.backend-translations";

export type UserBackendMessageKey =
  | "USER_NOT_FOUND"
  | "USER_PATCH_TENANT_ACCESS_DENIED"
  | "USER_PATCH_TENANT_SWITCH_FORBIDDEN"
  | "ENTERPRISE_CPF_OR_CNPJ_REQUIRED"
  | "ENTERPRISE_TENANT_ACCESS_DENIED"
  | "ENTERPRISE_NOT_FOUND"
  | "ENTERPRISE_NOT_MEMBER"
  | "ENTERPRISE_UPDATE_FORBIDDEN"
  | "ENTERPRISE_DELETE_OWNER_ONLY"
  | "ENTERPRISE_TRANSFER_OWNER_ONLY"
  | "ENTERPRISE_NEW_OWNER_MUST_BE_MEMBER"
  | "ENTERPRISE_GOOGLE_TOKENS_FORBIDDEN"
  | "ENTERPRISE_ACCESS_DENIED"
  | "ENTERPRISE_INSUFFICIENT_ROLE"
  | "ENTERPRISE_TENANT_NOT_RESOLVED"
  | "ENTERPRISE_SHORT_PATH_TAKEN"
  | "ENTERPRISE_SHORT_PATH_INVALID"
  | "ENTERPRISE_SHORT_PATH_RESERVED";

export const USER_BACKEND_MESSAGES: Record<
  UserBackendMessageKey,
  Record<BackendAuthLocale, string>
> = {
  USER_NOT_FOUND: {
    "en-US": "User not found.",
    "pt-BR": "Usuário não encontrado.",
  },
  USER_PATCH_TENANT_ACCESS_DENIED: {
    "en-US": "You do not have access to this workspace.",
    "pt-BR": "Você não tem acesso a este workspace.",
  },
  USER_PATCH_TENANT_SWITCH_FORBIDDEN: {
    "en-US": "You cannot change the active workspace.",
    "pt-BR": "Você não pode alterar o workspace ativo.",
  },
  ENTERPRISE_CPF_OR_CNPJ_REQUIRED: {
    "en-US": "At least one of CPF or CNPJ must be provided.",
    "pt-BR": "Informe pelo menos CPF ou CNPJ.",
  },
  ENTERPRISE_TENANT_ACCESS_DENIED: {
    "en-US": "You do not have access to this workspace.",
    "pt-BR": "Você não tem acesso a este workspace.",
  },
  ENTERPRISE_NOT_FOUND: {
    "en-US": "Enterprise not found.",
    "pt-BR": "Empresa não encontrada.",
  },
  ENTERPRISE_NOT_MEMBER: {
    "en-US": "You are not a member of this enterprise.",
    "pt-BR": "Você não é membro desta empresa.",
  },
  ENTERPRISE_UPDATE_FORBIDDEN: {
    "en-US": "You do not have permission to update this enterprise.",
    "pt-BR": "Você não tem permissão para atualizar esta empresa.",
  },
  ENTERPRISE_DELETE_OWNER_ONLY: {
    "en-US": "Only the owner can delete the enterprise.",
    "pt-BR": "Apenas o proprietário pode excluir a empresa.",
  },
  ENTERPRISE_TRANSFER_OWNER_ONLY: {
    "en-US": "Only the owner can transfer ownership.",
    "pt-BR": "Apenas o proprietário pode transferir a propriedade.",
  },
  ENTERPRISE_NEW_OWNER_MUST_BE_MEMBER: {
    "en-US": "The new owner must be a member of the enterprise.",
    "pt-BR": "O novo proprietário deve ser membro da empresa.",
  },
  ENTERPRISE_GOOGLE_TOKENS_FORBIDDEN: {
    "en-US": "You do not have permission to update Google tokens.",
    "pt-BR": "Você não tem permissão para atualizar os tokens do Google.",
  },
  ENTERPRISE_ACCESS_DENIED: {
    "en-US": "You do not have access to this enterprise.",
    "pt-BR": "Você não tem acesso a esta empresa.",
  },
  ENTERPRISE_INSUFFICIENT_ROLE: {
    "en-US": "You do not have the required permissions.",
    "pt-BR": "Você não tem as permissões necessárias.",
  },
  ENTERPRISE_TENANT_NOT_RESOLVED: {
    "en-US": "Workspace could not be resolved for this enterprise.",
    "pt-BR": "Não foi possível resolver o workspace desta empresa.",
  },
  ENTERPRISE_SHORT_PATH_TAKEN: {
    "en-US": "This short URL is already in use.",
    "pt-BR": "Este link curto já está em uso.",
  },
  ENTERPRISE_SHORT_PATH_INVALID: {
    "en-US": "This short URL is not valid.",
    "pt-BR": "Este link curto não é válido.",
  },
  ENTERPRISE_SHORT_PATH_RESERVED: {
    "en-US": "This short URL is reserved and cannot be used.",
    "pt-BR": "Este link curto é reservado e não pode ser usado.",
  },
};

export function getUserBackendMessage(
  key: UserBackendMessageKey,
  locale: BackendAuthLocale,
): string {
  return USER_BACKEND_MESSAGES[key][locale];
}
