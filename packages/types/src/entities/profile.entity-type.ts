// Profile = a reusable, named permission role (e.g. "Secretário") that groups a
// set of application modules. Profiles are independent of users; a user is
// linked to one or more profiles through the `pivot_user_profiles` table.
//
// Module keys are stored UPPERCASE (no accents/spaces) for fast equality checks.
// Shared by backend (entity/migration/service) and frontend (panel/sidebar).

/** Canonical, deduplicated list of application modules (UPPERCASE keys = stored value). */
export const APP_MODULES = [
    "PAGINA_INICIAL",
    "PERFIL",
    "ESTOQUE_CUSTOS",
    "SERVICOS",
    "CATEGORIAS_FORNECEDORES",
    "ESTOQUES",
    "ORDEM_SERVICO",
    "MALETAS_MEDICACAO",
    "USUARIOS",
    "CONTAS",
    "RECEBIVEIS",
    "FATURAMENTO",
    "COLABORADORES",
    "MANUTENCOES",
    "VTR",
    "CONTROLE_CONTAS",
    "CLIENTES",
    "ESTABELECIMENTOS",
    "RELATORIOS",
    "FORNECEDORES",
] as const;

/** Union of valid module keys. */
export type AppModule = (typeof APP_MODULES)[number];

/** Display labels (pt-BR) keyed by module. Frontend renders these; storage uses the key. */
export const APP_MODULE_LABELS: Record<AppModule, string> = {
    PAGINA_INICIAL: "Página Inicial",
    PERFIL: "Perfil",
    ESTOQUE_CUSTOS: "Estoque/Custos",
    SERVICOS: "Serviços",
    CATEGORIAS_FORNECEDORES: "Categorias Fornecedores",
    ESTOQUES: "Estoques",
    ORDEM_SERVICO: "Ordem Serviço",
    MALETAS_MEDICACAO: "Maletas de Medicação",
    USUARIOS: "Usuários",
    CONTAS: "Contas",
    RECEBIVEIS: "Recebíveis",
    FATURAMENTO: "Faturamento",
    COLABORADORES: "Colaboradores",
    MANUTENCOES: "Manutenções",
    VTR: "VTR",
    CONTROLE_CONTAS: "Controle Contas",
    CLIENTES: "Clientes",
    ESTABELECIMENTOS: "Estabelecimentos",
    RELATORIOS: "Relatórios",
    FORNECEDORES: "Fornecedores",
};

/** Runtime guard for incoming strings (DTO validation, etc.). */
export const isAppModule = (value: unknown): value is AppModule =>
    typeof value === "string" &&
    (APP_MODULES as readonly string[]).includes(value);

/** Tenant DB `profiles` row — a named role with a set of allowed modules. */
export interface IProfileEntity {
    id: string;
    name: string;
    /** Allowed module keys. Ignored when permitAll is true. */
    modules: AppModule[];
    /** When true the role can see every module regardless of `modules`. */
    permitAll: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

/** Tenant DB `pivot_user_profiles` row — links a user to a profile (many-to-many). */
export interface IUserProfileLinkEntity {
    id: string;
    userId: string;
    profileId: string;
    createdAt: Date;
}

/** Effective permissions for the current user (consumed by the sidebar). */
export interface IUserEffectivePermissions {
    /** Union of modules across all profiles the user is linked to. */
    modules: AppModule[];
    /** True if any linked profile is permitAll, or the user has no profile yet. */
    permitAll: boolean;
    /** True if the user may manage profiles (has a permitAll profile or is admin). */
    canManage: boolean;
}
