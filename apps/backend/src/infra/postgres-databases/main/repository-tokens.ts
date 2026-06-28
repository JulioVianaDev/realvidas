/**
 * Repository Injection Tokens
 * Use these symbols for type-safe dependency injection
 */
export const REPOSITORY_TOKENS_MAIN = {
  // User
  USER_REPOSITORY: Symbol('USER_REPOSITORY'),
  TENANT_ADMIN_REPOSITORY: Symbol('TENANT_ADMIN_REPOSITORY'),

  // URL Shortener (public tenant/enterprise resolution by path)
  URL_SHORTENER_REPOSITORY: Symbol('URL_SHORTENER_REPOSITORY'),
} as const;
