import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNumber,
  IsIn,
} from 'class-validator';
import { Exact } from '@global-types/helpers/exact';
import {
  CreateUserBodyRequest,
  IPatchMyCurrentTenantBodyRequest,
  IPatchUserUiPreferencesBodyRequest,
  UpdateUserBodyRequest,
} from '@global-types/body-requests/user.body-request';
import { GetUsersParams } from '@global-types/params/user.params';
import { RoleType } from '@global-types/entities/user.entity-type';
import { Role } from 'src/infra/postgres-databases/main/entities/enums';

const USER_UI_LANGUAGES = ['pt-BR', 'en-US'] as const;
const USER_UI_THEMES = ['light', 'dark', 'system'] as const;
export class CreateUserDto
  implements Exact<CreateUserDto, CreateUserBodyRequest>
{
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsIn(USER_UI_LANGUAGES)
  language?: CreateUserBodyRequest['language'];

  @IsOptional()
  @IsIn(USER_UI_THEMES)
  theme?: CreateUserBodyRequest['theme'];
}

export class UpdateUserDto
  implements Exact<UpdateUserDto, UpdateUserBodyRequest>
{
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsIn(USER_UI_LANGUAGES)
  language?: UpdateUserBodyRequest['language'];

  @IsOptional()
  @IsIn(USER_UI_THEMES)
  theme?: UpdateUserBodyRequest['theme'];
}

export class PatchUserUiPreferencesDto
  implements
    Exact<
      PatchUserUiPreferencesDto,
      IPatchUserUiPreferencesBodyRequest
    >
{
  @IsOptional()
  @IsIn(USER_UI_LANGUAGES)
  language?: IPatchUserUiPreferencesBodyRequest['language'];

  @IsOptional()
  @IsIn(USER_UI_THEMES)
  theme?: IPatchUserUiPreferencesBodyRequest['theme'];
}

export class PatchMyCurrentTenantDto
  implements
    Exact<
      PatchMyCurrentTenantDto,
      IPatchMyCurrentTenantBodyRequest
    >
{
  @IsString()
  tenantId: IPatchMyCurrentTenantBodyRequest['tenantId'];
}

export class GetUsersDto
  implements Exact<GetUsersDto, GetUsersParams>
{
  page?: number;
  pageSize?: number;
  search?: string;
  role?: RoleType | 'ALL';
}
