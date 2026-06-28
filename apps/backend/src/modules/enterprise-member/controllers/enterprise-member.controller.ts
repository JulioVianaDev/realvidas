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
} from '@nestjs/common';
import {
  IAddEnterpriseMemberResponse,
  IDeleteEnterpriseMemberResponse,
  IGetEnterpriseMemberByIdResponse,
  IGetEnterpriseMembersResponse,
  IUpdateEnterpriseMemberResponse,
} from '@global-types/responses/enterprise-member.response';
import { EnterpriseMemberService } from '../services/enterprise-member.service';
import { AuthGuard } from '@nestjs/passport';
import {
  AddEnterpriseMemberDto,
  UpdateEnterpriseMemberDto,
  GetEnterpriseMembersDto,
} from '../dto/enterprise-member.dto';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWTUser } from 'src/modules/auth/guard/user.decorator';
import { JWTUserType } from '@global-types/entities/user.entity-type';

@Controller({ path: 'enterprise-members', version: '1' })
@ApiTags('Enterprise Members')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EnterpriseMemberController {
  constructor(
    private enterpriseMemberService: EnterpriseMemberService,
  ) {}

  @Get()
  async getAllMembers(
    @JWTUser() user: JWTUserType,
    @Query() params: GetEnterpriseMembersDto,
  ): Promise<IGetEnterpriseMembersResponse> {
    return this.enterpriseMemberService.getAllMembers(
      params,
      user.id,
    );
  }

  @Get(':id')
  async getMemberById(
    @JWTUser() user: JWTUserType,
    @Param('id') id: string,
  ): Promise<IGetEnterpriseMemberByIdResponse> {
    return this.enterpriseMemberService.getMemberById(id, user.id);
  }

  @Post(':enterpriseId')
  async addMember(
    @JWTUser() user: JWTUserType,
    @Param('enterpriseId') enterpriseId: string,
    @Body() addMemberDto: AddEnterpriseMemberDto,
  ): Promise<IAddEnterpriseMemberResponse> {
    return this.enterpriseMemberService.addMember(
      enterpriseId,
      user.id,
      addMemberDto,
    );
  }

  @Patch(':id')
  async updateMember(
    @JWTUser() user: JWTUserType,
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateEnterpriseMemberDto,
  ): Promise<IUpdateEnterpriseMemberResponse> {
    return this.enterpriseMemberService.updateMember(
      id,
      user.id,
      updateMemberDto,
    );
  }

  @Delete(':id')
  async removeMember(
    @JWTUser() user: JWTUserType,
    @Param('id') id: string,
  ): Promise<IDeleteEnterpriseMemberResponse> {
    return this.enterpriseMemberService.removeMember(id, user.id);
  }
}

