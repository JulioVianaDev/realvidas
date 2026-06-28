import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { JWTUser } from 'src/modules/auth/guard/user.decorator';
import { JWTUserType } from '@global-types/entities/user.entity-type';
import {
  IGetProfilesResponse,
  IGetProfileByIdResponse,
  ICreateProfileResponse,
  IUpdateProfileResponse,
  IDeleteProfileResponse,
  IGetUserAssignedProfilesResponse,
  IAssignUserProfilesResponse,
  IGetMyUserProfileResponse,
} from '@global-types/responses/profile.response';
import { ProfileService } from '../services/profile.service';
import {
  CreateProfileDto,
  UpdateProfileDto,
  GetProfilesDto,
  AssignUserProfilesDto,
} from '../dto/profile.dto';

@Controller({ path: 'profiles', version: '1' })
@ApiTags('Profiles')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /** Current user's effective module permissions (consumed by the sidebar). */
  @Get('me')
  async getMine(
    @JWTUser() user: JWTUserType,
  ): Promise<IGetMyUserProfileResponse> {
    return this.profileService.getMyPermissions(user.id, user.role);
  }

  /** Profiles currently linked to a given user. */
  @Get('user/:userId')
  async getUserProfiles(
    @JWTUser() user: JWTUserType,
    @Param('userId') userId: string,
  ): Promise<IGetUserAssignedProfilesResponse> {
    return this.profileService.getUserProfiles(
      userId,
      user.id,
      user.role,
    );
  }

  /** Replace the full set of profiles linked to a user (the vinculus). */
  @Post('assign')
  async assignUserProfiles(
    @JWTUser() user: JWTUserType,
    @Body() payload: AssignUserProfilesDto,
  ): Promise<IAssignUserProfilesResponse> {
    return this.profileService.assignUserProfiles(
      payload,
      user.id,
      user.role,
    );
  }

  @Get()
  async getAll(
    @JWTUser() user: JWTUserType,
    @Query() params: GetProfilesDto,
  ): Promise<IGetProfilesResponse> {
    return this.profileService.getAll(params, user.id, user.role);
  }

  @Get(':id')
  async getById(
    @JWTUser() user: JWTUserType,
    @Param('id') id: string,
  ): Promise<IGetProfileByIdResponse> {
    return this.profileService.getById(id, user.id, user.role);
  }

  @Post()
  async create(
    @JWTUser() user: JWTUserType,
    @Body() payload: CreateProfileDto,
  ): Promise<ICreateProfileResponse> {
    return this.profileService.create(payload, user.id, user.role);
  }

  @Patch(':id')
  async update(
    @JWTUser() user: JWTUserType,
    @Param('id') id: string,
    @Body() payload: UpdateProfileDto,
  ): Promise<IUpdateProfileResponse> {
    return this.profileService.update(
      id,
      payload,
      user.id,
      user.role,
    );
  }

  @Delete(':id')
  async remove(
    @JWTUser() user: JWTUserType,
    @Param('id') id: string,
  ): Promise<IDeleteProfileResponse> {
    return this.profileService.remove(id, user.id, user.role);
  }
}
