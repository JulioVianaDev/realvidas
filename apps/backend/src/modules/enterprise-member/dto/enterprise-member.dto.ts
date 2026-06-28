import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Exact } from '@global-types/helpers/exact';
import {
  IAddEnterpriseMemberBodyRequest,
  IUpdateEnterpriseMemberBodyRequest,
} from '@global-types/body-requests/enterprise-member.body-request';
import { IGetEnterpriseMembersParams } from '@global-types/params/enterprise-member.params';
import { EnterpriseRole } from 'src/infra/postgres-databases/main/entities/enums';
import { EnterpriseRoleType } from '@global-types/entities/enterprise-member.entity-type';

export class AddEnterpriseMemberDto
  implements Exact<AddEnterpriseMemberDto, IAddEnterpriseMemberBodyRequest>
{
  @IsUUID()
  userId: string;

  @IsEnum(EnterpriseRole)
  role: EnterpriseRole;
}

export class UpdateEnterpriseMemberDto
  implements
    Exact<UpdateEnterpriseMemberDto, IUpdateEnterpriseMemberBodyRequest>
{
  @IsOptional()
  @IsEnum(EnterpriseRole)
  role?: EnterpriseRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class GetEnterpriseMembersDto
  implements
    Exact<
      GetEnterpriseMembersDto,
      IGetEnterpriseMembersParams
    >
{
  @IsString()
  enterpriseId: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  role?: EnterpriseRoleType | 'ALL';

  @IsOptional()
  @Transform(({ value }) => {
    console.log(value);
    console.log(typeof value);
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}

