export interface IStartUserTenantBodyRequest {
    enterpriseName: string;
    cpf?: string | null;
    cnpj?: string | null;
    email?: string | null;
    timezone?: string | null;
}
