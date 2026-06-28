import { BrState } from "../entities/customer.entity-type";

export interface ICreateCustomerBodyRequest {
    razaoSocial: string;
    nomeFantasia?: string | null;
    cnpjCpf?: string | null;
    responsavel?: string | null;
    email?: string | null;
    telefone?: string | null;
    celular?: string | null;
    phoneCountry?: string | null;
    endereco?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    cep?: string | null;
    estado?: BrState | null;
    limiteTolerancia?: number | null;
}

export type IUpdateCustomerBodyRequest =
    Partial<ICreateCustomerBodyRequest>;
