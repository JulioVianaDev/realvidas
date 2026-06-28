/** Matches TypeORM Role enum (main DB). */
export type RoleType = "ADMIN" | "USER" | "SELLER";

export const RoleValues: Record<RoleType, RoleType> = {
  ADMIN: "ADMIN",
  USER: "USER",
  SELLER: "SELLER",
};

/** Matches TypeORM UserTenantRole enum (main DB pivot). */
export type UserTenantRoleType = "OWNER" | "ADMIN" | "MEMBER";

export const UserTenantRoleValues: Record<UserTenantRoleType, UserTenantRoleType> =
  {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
  };

export type JWTUserType = {
  role: RoleType;
  id: string;
  emailConfirmed?: boolean;
  language?: string;
};

/** UI theme stored for the user (emails use light/dark; `system` is client-only hint). */
export type UserUiThemePreference = "light" | "dark" | "system";

/** App locale stored for the user (emails and copy). */
export type UserUiLanguagePreference = "pt-BR" | "en-US";

/** Matches TypeORM UserEntity (main DB users table). */
export type IUserEntity = {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  password: string | null;
  imageUrl: string | null;
  role: RoleType;
  age: number | null;
  language: string | null;
  theme: string | null;
  /** True when the user has confirmed their email (same as “authenticated by email”). */
  emailConfirmed: boolean;
  currentTenantViewId: string | null;
  registerCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

/** User entity without sensitive fields (e.g. for API responses). */
export type UserTypeReturn = Omit<IUserEntity, "password"> & {
  /** Set on GET user by id: true if user has ≥1 row in pivot_relation_user_tenant (main DB). */
  hasTenantMembership?: boolean;
};
