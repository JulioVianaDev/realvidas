import {
  IsInt,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { Exact } from '@global-types/helpers/exact';
import {
  ICreateCustomerBodyRequest,
  IUpdateCustomerBodyRequest,
} from '@global-types/body-requests/customer.body-request';
import { IGetAllCustomersParams } from '@global-types/params/customer.params';
import {
  BR_STATES,
  BrState,
} from '@global-types/entities/customer.entity-type';

export class CreateCustomerDto
  implements Exact<CreateCustomerDto, ICreateCustomerBodyRequest>
{
  @IsString()
  razaoSocial: string;

  @IsOptional()
  @IsString()
  nomeFantasia?: string | null;

  @IsOptional()
  @IsString()
  cnpjCpf?: string | null;

  @IsOptional()
  @IsString()
  responsavel?: string | null;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsOptional()
  @IsString()
  telefone?: string | null;

  @IsOptional()
  @IsString()
  celular?: string | null;

  @IsOptional()
  @IsString()
  phoneCountry?: string | null;

  @IsOptional()
  @IsString()
  endereco?: string | null;

  @IsOptional()
  @IsString()
  complemento?: string | null;

  @IsOptional()
  @IsString()
  bairro?: string | null;

  @IsOptional()
  @IsString()
  cidade?: string | null;

  @IsOptional()
  @IsString()
  cep?: string | null;

  @IsOptional()
  @IsIn(BR_STATES as unknown as string[])
  estado?: BrState | null;

  @IsOptional()
  @IsInt()
  limiteTolerancia?: number | null;
}

export class UpdateCustomerDto
  implements Exact<UpdateCustomerDto, IUpdateCustomerBodyRequest>
{
  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @IsOptional()
  @IsString()
  nomeFantasia?: string | null;

  @IsOptional()
  @IsString()
  cnpjCpf?: string | null;

  @IsOptional()
  @IsString()
  responsavel?: string | null;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsOptional()
  @IsString()
  telefone?: string | null;

  @IsOptional()
  @IsString()
  celular?: string | null;

  @IsOptional()
  @IsString()
  phoneCountry?: string | null;

  @IsOptional()
  @IsString()
  endereco?: string | null;

  @IsOptional()
  @IsString()
  complemento?: string | null;

  @IsOptional()
  @IsString()
  bairro?: string | null;

  @IsOptional()
  @IsString()
  cidade?: string | null;

  @IsOptional()
  @IsString()
  cep?: string | null;

  @IsOptional()
  @IsIn(BR_STATES as unknown as string[])
  estado?: BrState | null;

  @IsOptional()
  @IsInt()
  limiteTolerancia?: number | null;
}

export class GetCustomersDto
  implements Exact<GetCustomersDto, IGetAllCustomersParams>
{
  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
