import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateUserDto,
  GetUsersDto,
  PatchMyCurrentTenantDto,
  PatchUserUiPreferencesDto,
  UpdateUserDto,
} from '../dto/user.dto';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { Roles } from 'src/modules/auth/guard/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import {
  FileInterceptor,
  File,
  FilesInterceptor,
} from '@nest-lab/fastify-multer';
import { JWTUser } from 'src/modules/auth/guard/user.decorator';
import { JWTUserType } from '@global-types/entities/user.entity-type';
import { Role } from 'src/infra/postgres-databases/main/entities/enums';
import {
  GetUserByIdResponse,
  GetUsersResponse,
  IPatchUserUiPreferencesResponse,
  UpdateOrCreateUserResponse,
} from '@global-types/responses/user.response';

@Controller({ path: 'users', version: '1' })
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  @Roles(Role.ADMIN)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UpdateOrCreateUserResponse | null> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(
    @Query() params: GetUsersDto,
  ): Promise<GetUsersResponse> {
    return this.userService.getAllUsers(params);
  }

  @Patch('me/ui-preferences')
  async patchMyUiPreferences(
    @JWTUser() user: JWTUserType,
    @Body() body: PatchUserUiPreferencesDto,
  ): Promise<IPatchUserUiPreferencesResponse> {
    return this.userService.patchMyUiPreferences(user.id, body);
  }

  @Patch('me/current-tenant')
  async patchMyCurrentTenant(
    @JWTUser() user: JWTUserType,
    @Body() body: PatchMyCurrentTenantDto,
  ): Promise<GetUserByIdResponse> {
    return this.userService.patchMyCurrentTenant(user.id, body);
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: string,
  ): Promise<GetUserByIdResponse> {
    return this.userService.getUserById(id);
  }

  @Put('/edit/:id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    body: UpdateUserDto,
  ): Promise<GetUserByIdResponse> {
    return this.userService.updateUser(id, body);
  }

  @Delete('/delete/:id')
  async deleteUser(
    @Param('id') id: string,
  ): Promise<{ success: boolean; id: string }> {
    return this.userService.deleteUser(id);
  }

  @Patch('/reset-password/:id')
  @Roles(Role.ADMIN)
  async resetPassword(
    @Param('id') id: string,
  ): Promise<GetUserByIdResponse> {
    return this.userService.resetPassword(id);
  }

  @Post('/import-by-file')
  @ApiOperation({ summary: 'Uploads a single file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Roles(Role.ADMIN)
  async singleFile(
    @UploadedFile() file: File,
    @JWTUser() user: JWTUserType,
  ): Promise<{ success: boolean; message: string }> {
    console.log('chegou');
    return await this.userService.createUsersByFile(file);
  }

  @Patch('/files')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Uploads multiple files' })
  @UseInterceptors(FilesInterceptor('files', 4))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  multipleFiles(@UploadedFiles() files: Array<File>) {
    return console.log(files);
  }
}
