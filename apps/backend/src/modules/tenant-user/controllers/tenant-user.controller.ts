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
  IGetTenantUsersResponse,
  ICreateTenantUserResponse,
  IUpdateTenantUserResponse,
  IDeleteTenantUserResponse,
} from '@global-types/responses/tenant-user.response';
import { TenantUserService } from '../services/tenant-user.service';
import {
  CreateTenantUserDto,
  UpdateTenantUserDto,
  GetTenantUsersDto,
} from '../dto/tenant-user.dto';

@Controller({ path: 'tenant-users', version: '1' })
@ApiTags('Tenant Users')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TenantUserController {
  constructor(
    private readonly tenantUserService: TenantUserService,
  ) {}

  @Get()
  async getAll(
    @JWTUser() user: JWTUserType,
    @Query() params: GetTenantUsersDto,
  ): Promise<IGetTenantUsersResponse> {
    return this.tenantUserService.getAll(params, user.id, user.role);
  }

  @Post()
  async create(
    @JWTUser() user: JWTUserType,
    @Body() payload: CreateTenantUserDto,
  ): Promise<ICreateTenantUserResponse> {
    return this.tenantUserService.create(payload, user.id, user.role);
  }

  @Patch(':userId')
  async update(
    @JWTUser() user: JWTUserType,
    @Param('userId') userId: string,
    @Body() payload: UpdateTenantUserDto,
  ): Promise<IUpdateTenantUserResponse> {
    return this.tenantUserService.update(
      userId,
      payload,
      user.id,
      user.role,
    );
  }

  @Delete(':userId')
  async remove(
    @JWTUser() user: JWTUserType,
    @Param('userId') userId: string,
  ): Promise<IDeleteTenantUserResponse> {
    return this.tenantUserService.remove(userId, user.id, user.role);
  }
}
