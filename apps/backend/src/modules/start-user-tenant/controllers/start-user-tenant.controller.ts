import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWTUser } from 'src/modules/auth/guard/user.decorator';
import { JWTUserType } from '@global-types/entities/user.entity-type';
import { IStartUserTenantResponse } from '@global-types/responses/start-user-tenant.response';
import { StartUserTenantDto } from '../dto/start-user-tenant.dto';
import { StartUserTenantService } from '../services/start-user-tenant.service';

@Controller({ path: 'start-user-tenant', version: '1' })
@ApiTags('Start User Tenant')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class StartUserTenantController {
  constructor(
    private readonly startUserTenantService: StartUserTenantService,
  ) {}

  @Post()
  async startUserTenant(
    @JWTUser() user: JWTUserType,
    @Body() payload: StartUserTenantDto,
  ): Promise<IStartUserTenantResponse> {
    return this.startUserTenantService.startUserTenant(
      user.id,
      payload,
    );
  }
}
