import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nest-lab/fastify-multer';
import { File } from '@nest-lab/fastify-multer';
import { EnterpriseService } from '../services/enterprise.service';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateEnterpriseDto,
  UpdateEnterpriseDto,
  GetEnterprisesDto,
  GetMyEnterprisesDto,
  GetEnterprisesByTenantDto,
  TransferEnterpriseOwnershipDto,
  UpdateEnterpriseGoogleTokensDto,
  CheckShortPathDto,
} from '../dto/enterprise.dto';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { Roles } from 'src/modules/auth/guard/roles.decorator';
import { Role } from 'src/infra/postgres-databases/main/entities/enums';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWTUser } from 'src/modules/auth/guard/user.decorator';
import { JWTUserType } from '@global-types/entities/user.entity-type';
import {
  ICreateEnterpriseResponse,
  IDeleteEnterpriseResponse,
  IGetEnterpriseByIdResponse,
  IGetEnterprisesResponse,
  IGetMyEnterprisesResponse,
  ITransferOwnershipResponse,
  IUpdateEnterpriseResponse,
} from '@global-types/responses/enterprise.response';
import { IShortPathAvailabilityResponse } from '@global-types/entities/url-shortener.entity-type';
import {
  EnterpriseOption,
  TenantOption,
} from 'src/infra/postgres-databases/main/repositories/tenant-admin/tenant-admin.contract.repository';

@Controller({ path: 'enterprises', version: '1' })
@ApiTags('Enterprises')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EnterpriseController {
  constructor(private enterpriseService: EnterpriseService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createEnterprise(
    @JWTUser() user: JWTUserType,
    @UploadedFile() file: File | undefined,
    @Body() createEnterpriseDto: CreateEnterpriseDto,
  ): Promise<ICreateEnterpriseResponse> {
    return this.enterpriseService.createEnterprise(
      user.id,
      createEnterpriseDto,
      file,
    );
  }

  @Get()
  @Roles(Role.ADMIN)
  async getAllEnterprises(
    @Query() params: GetEnterprisesDto,
  ): Promise<IGetEnterprisesResponse> {
    return this.enterpriseService.getAllEnterprises(params);
  }

  @Get('my')
  async getMyEnterprises(
    @JWTUser() user: JWTUserType,
    @Query() params: GetMyEnterprisesDto,
  ): Promise<IGetMyEnterprisesResponse> {
    return this.enterpriseService.getMyEnterprises(user.id, params);
  }

  @Get('short-path/check')
  async checkShortPathAvailability(
    @Query() query: CheckShortPathDto,
    @Query('excludeEnterpriseId') excludeEnterpriseId?: string,
  ): Promise<IShortPathAvailabilityResponse> {
    return this.enterpriseService.checkShortPathAvailability(
      query.path,
      excludeEnterpriseId,
    );
  }

  @Get('admin/tenants')
  @Roles(Role.ADMIN)
  async adminListTenants(): Promise<TenantOption[]> {
    return this.enterpriseService.adminListTenants();
  }

  @Get('tenants/:tenantId/enterprises')
  async getEnterprisesByTenant(
    @JWTUser() user: JWTUserType,
    @Param() params: GetEnterprisesByTenantDto,
  ): Promise<EnterpriseOption[]> {
    return this.enterpriseService.listEnterprisesByTenant(
      params.tenantId,
      user.id,
      user.role as Role,
    );
  }

  @Get(':id')
  async getEnterpriseById(
    @JWTUser() user: JWTUserType,
    @Param('id') id: string,
  ): Promise<IGetEnterpriseByIdResponse> {
    return this.enterpriseService.getEnterpriseById(id, user.id);
  }

  @Patch(':id')
  async updateEnterprise(
    @JWTUser() user: JWTUserType,
    @Param('id') id: string,
    @Body() updateEnterpriseDto: UpdateEnterpriseDto,
  ): Promise<IUpdateEnterpriseResponse> {
    return this.enterpriseService.updateEnterprise(
      id,
      user.id,
      updateEnterpriseDto,
    );
  }

  @Delete(':id')
  async deleteEnterprise(
    @JWTUser() user: JWTUserType,
    @Param('id') id: string,
  ): Promise<IDeleteEnterpriseResponse> {
    return this.enterpriseService.deleteEnterprise(id, user.id);
  }

  @Post(':id/transfer-ownership')
  async transferOwnership(
    @JWTUser() user: JWTUserType,
    @Param('id') id: string,
    @Body() transferDto: TransferEnterpriseOwnershipDto,
  ): Promise<ITransferOwnershipResponse> {
    return this.enterpriseService.transferOwnership(
      id,
      user.id,
      transferDto,
    );
  }

  @Patch(':id/google-tokens')
  async updateGoogleTokens(
    @JWTUser() user: JWTUserType,
    @Param('id') id: string,
    @Body() tokensDto: UpdateEnterpriseGoogleTokensDto,
  ): Promise<IUpdateEnterpriseResponse> {
    return this.enterpriseService.updateGoogleTokens(
      id,
      user.id,
      tokensDto,
    );
  }
}
