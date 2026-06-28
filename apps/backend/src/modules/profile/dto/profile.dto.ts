import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Exact } from '@global-types/helpers/exact';
import {
  ICreateProfileBodyRequest,
  IUpdateProfileBodyRequest,
  IAssignUserProfilesBodyRequest,
} from '@global-types/body-requests/profile.body-request';
import { IGetProfilesParams } from '@global-types/params/profile.params';
import {
  APP_MODULES,
  AppModule,
} from '@global-types/entities/profile.entity-type';

export class CreateProfileDto
  implements Exact<CreateProfileDto, ICreateProfileBodyRequest>
{
  @IsString()
  name: string;

  @IsArray()
  @IsIn(APP_MODULES as unknown as string[], { each: true })
  modules: AppModule[];

  @IsBoolean()
  permitAll: boolean;
}

export class UpdateProfileDto
  implements Exact<UpdateProfileDto, IUpdateProfileBodyRequest>
{
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsIn(APP_MODULES as unknown as string[], { each: true })
  modules?: AppModule[];

  @IsOptional()
  @IsBoolean()
  permitAll?: boolean;
}

export class AssignUserProfilesDto
  implements
    Exact<AssignUserProfilesDto, IAssignUserProfilesBodyRequest>
{
  @IsUUID()
  userId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  profileIds: string[];
}

export class GetProfilesDto
  implements Exact<GetProfilesDto, IGetProfilesParams>
{
  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
