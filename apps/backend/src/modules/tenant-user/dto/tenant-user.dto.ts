import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Exact } from '@global-types/helpers/exact';
import {
  ICreateTenantUserBodyRequest,
  IUpdateTenantUserBodyRequest,
} from '@global-types/body-requests/tenant-user.body-request';
import { IGetTenantUsersParams } from '@global-types/params/tenant-user.params';

export class CreateTenantUserDto
  implements Exact<CreateTenantUserDto, ICreateTenantUserBodyRequest>
{
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsArray()
  @IsUUID('all', { each: true })
  profileIds: string[];
}

export class UpdateTenantUserDto
  implements Exact<UpdateTenantUserDto, IUpdateTenantUserBodyRequest>
{
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  profileIds?: string[];
}

export class GetTenantUsersDto
  implements Exact<GetTenantUsersDto, IGetTenantUsersParams>
{
  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
