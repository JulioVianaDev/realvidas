/**
 * Storage Provider Injection Tokens
 * Use these symbols for type-safe dependency injection
 */
export const STORAGE_TOKENS = {
  STORAGE_PROVIDER: Symbol('STORAGE_PROVIDER'),
} as const;

export type StorageTokens =
  (typeof STORAGE_TOKENS)[keyof typeof STORAGE_TOKENS];

