// B2B customer ("Cliente") stored in the tenant database. Fields mirror the
// customer registration form (Razão Social, CNPJ/CPF, address, etc.).

/** Brazilian state (UF) codes used by the `estado` field. */
export const BR_STATES = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
] as const;

export type BrState = (typeof BR_STATES)[number];

export interface ICustomerEntity {
    id: string;
    /** Razão Social (legal company name) — required. */
    razaoSocial: string;
    /** Nome Fantasia (trade name). */
    nomeFantasia: string | null;
    /** CNPJ/CPF document number. */
    cnpjCpf: string | null;
    /** Responsável pelo contato. */
    responsavel: string | null;
    email: string | null;
    telefone: string | null;
    celular: string | null;
    /** ISO2 country code of the phone (e.g. "br") — drives the flag in the UI. */
    phoneCountry: string | null;
    /** Endereço / Logradouro. */
    endereco: string | null;
    complemento: string | null;
    bairro: string | null;
    cidade: string | null;
    cep: string | null;
    /** Estado (UF). */
    estado: BrState | null;
    /** Limite Tolerância. */
    limiteTolerancia: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
