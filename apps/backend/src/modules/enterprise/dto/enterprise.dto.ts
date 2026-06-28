import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  IsDateString,
  IsNumber,
  ValidateNested,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Exact } from '@global-types/helpers/exact';
import {
  ICreateEnterpriseBodyRequest,
  IUpdateEnterpriseBodyRequest,
  ITransferEnterpriseOwnershipBodyRequest,
  IUpdateEnterpriseGoogleTokensBodyRequest,
  IPhoneData,
} from '@global-types/body-requests/enterprise.body-request';
import { ENTERPRISE_DESCRIPTION_MAX_LENGTH } from '@global-types/entities/enterprise.entity-type';
import {
  SHORT_PATH_MAX_LENGTH,
  SHORT_PATH_MIN_LENGTH,
  SHORT_PATH_REGEX,
} from '@global-types/entities/url-shortener.entity-type';
import {
  IGetEnterprisesParams,
  IGetMyEnterprisesParams,
} from '@global-types/params/enterprise.params';

export class PhoneDataDto
  implements Exact<PhoneDataDto, IPhoneData>
{
  @IsString()
  phone: IPhoneData['phone'];

  @IsString()
  country: IPhoneData['country'];
}

export class CreateEnterpriseDto
  implements
    Exact<CreateEnterpriseDto, ICreateEnterpriseBodyRequest>
{
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  cpf?: string | null;

  @IsOptional()
  @IsString()
  cnpj?: string | null;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @Transform(({ value }) => {
    console.log('value', value);
    console.log('typeof value', typeof value);

    return value;
  })
  @ValidateNested()
  @Type(() => PhoneDataDto)
  phone?: IPhoneData | null;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  @IsString()
  timezone?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(ENTERPRISE_DESCRIPTION_MAX_LENGTH)
  description?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(SHORT_PATH_MIN_LENGTH)
  @MaxLength(SHORT_PATH_MAX_LENGTH)
  @Matches(SHORT_PATH_REGEX)
  shortPath?: string | null;
}

export class UpdateEnterpriseDto
  implements
    Exact<UpdateEnterpriseDto, IUpdateEnterpriseBodyRequest>
{
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  cpf?: string | null;

  @IsOptional()
  @IsString()
  cnpj?: string | null;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @ValidateNested()
  @Type(() => PhoneDataDto)
  phone?: IPhoneData | null;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  @IsString()
  timezone?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(ENTERPRISE_DESCRIPTION_MAX_LENGTH)
  description?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(SHORT_PATH_MIN_LENGTH)
  @MaxLength(SHORT_PATH_MAX_LENGTH)
  @Matches(SHORT_PATH_REGEX)
  shortPath?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CheckShortPathDto {
  @IsString()
  @MinLength(SHORT_PATH_MIN_LENGTH)
  @MaxLength(SHORT_PATH_MAX_LENGTH)
  @Matches(SHORT_PATH_REGEX)
  path: string;
}

export class TransferEnterpriseOwnershipDto
  implements
    Exact<TransferEnterpriseOwnershipDto, ITransferEnterpriseOwnershipBodyRequest>
{
  @IsUUID()
  newOwnerId: string;
}

export class UpdateEnterpriseGoogleTokensDto
  implements
    Exact<UpdateEnterpriseGoogleTokensDto, IUpdateEnterpriseGoogleTokensBodyRequest>
{
  @IsEmail()
  mainGoogleEmail: string;

  @IsString()
  googleRefreshToken: string;

  @IsString()
  googleAccessToken: string;

  @IsDateString()
  tokenExpiresAt: Date;
}

export class GetEnterprisesDto
  implements Exact<GetEnterprisesDto, IGetEnterprisesParams>
{
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}

export class GetMyEnterprisesDto
  implements Exact<GetMyEnterprisesDto, IGetMyEnterprisesParams>
{
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  includeInactive?: boolean;
}

export class GetEnterprisesByTenantDto {
  @IsUUID()
  tenantId: string;
}

