import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  GetUsersDto,
  PatchMyCurrentTenantDto,
  PatchUserUiPreferencesDto,
  UpdateUserDto,
} from '../dto/user.dto';
import {
  GetUsersResponse,
  GetUserByIdResponse,
  IPatchUserUiPreferencesResponse,
  UpdateOrCreateUserResponse,
} from '@global-types/responses/user.response';
import { File } from '@nest-lab/fastify-multer';
import {
  CreateUserOptions,
  IUserContractRepository,
} from '../../../infra/postgres-databases/main/repositories/user/user.contract.repository';
import { REPOSITORY_TOKENS_MAIN } from 'src/infra/postgres-databases/main/repository-tokens';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/infra/postgres-databases/main/entities/user.entity';
import { UserTenantViewCacheService } from 'src/infra/postgres-databases/tenant/user-tenant-view-cache.service';
import { SocketService } from 'src/modules/socket/socket.service';
import { BackendTranslatorService } from 'src/modules/common/services/backend-translator.service';

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource() private readonly mainDataSource: DataSource,
    @Inject(REPOSITORY_TOKENS_MAIN.USER_REPOSITORY)
    private readonly userRepository: IUserContractRepository,
    private readonly socketService: SocketService,
    private readonly userTenantViewCache: UserTenantViewCacheService,
    private readonly translator: BackendTranslatorService,
  ) {}

  async createUser(
    data: CreateUserDto,
    options?: CreateUserOptions,
  ): Promise<UpdateOrCreateUserResponse | null> {
    return this.userRepository.createUser(data, options);
  }

  async getAllUsers(
    params: GetUsersDto,
  ): Promise<GetUsersResponse> {
    return this.userRepository.getAllUsers(params);
  }

  async getUserById(
    id: string,
  ): Promise<GetUserByIdResponse> {
    return this.userRepository.getUserById(id);
  }

  async updateUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<GetUserByIdResponse> {
    return this.userRepository.updateUser(id, data);
  }

  async patchMyUiPreferences(
    userId: string,
    data: PatchUserUiPreferencesDto,
  ): Promise<IPatchUserUiPreferencesResponse> {
    if (data.language == null && data.theme == null) {
      const u = await this.userRepository.getUserById(userId);
      if (!u) {
        throw new NotFoundException(
          this.translator.userMessage('USER_NOT_FOUND'),
        );
      }
      return { id: u.id, language: u.language, theme: u.theme };
    }
    const updated = await this.userRepository.updateUser(userId, data);
    if (!updated) {
      throw new NotFoundException(
        this.translator.userMessage('USER_NOT_FOUND'),
      );
    }
    return {
      id: updated.id,
      language: updated.language,
      theme: updated.theme,
    };
  }

  async patchMyCurrentTenant(
    userId: string,
    data: PatchMyCurrentTenantDto,
  ): Promise<GetUserByIdResponse> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException(
        this.translator.userMessage('USER_NOT_FOUND'),
      );
    }

    if (user.role !== 'ADMIN') {
      const [{ exists }] = await this.mainDataSource.query(
        `SELECT EXISTS(SELECT 1 FROM "pivot_relation_user_tenant" WHERE "userId" = $1 AND "tenantId" = $2) AS "exists"`,
        [userId, data.tenantId],
      );
      if (!exists) {
        throw new ForbiddenException(
          this.translator.userMessage('USER_PATCH_TENANT_ACCESS_DENIED'),
        );
      }
    }

    if (
      user.role !== 'ADMIN' &&
      user.currentTenantViewId &&
      user.currentTenantViewId !== data.tenantId
    ) {
      throw new BadRequestException(
        this.translator.userMessage('USER_PATCH_TENANT_SWITCH_FORBIDDEN'),
      );
    }

    await this.mainDataSource.getRepository(UserEntity).update(userId, {
      currentTenantViewId: data.tenantId,
    });
    await this.userTenantViewCache.set(userId, data.tenantId);
    this.socketService.setUserActiveTenant(userId, data.tenantId);

    return this.userRepository.getUserById(userId);
  }

  async deleteUser(
    id: string,
  ): Promise<{ success: boolean; id: string }> {
    return this.userRepository.deleteUser(id);
  }

  async createUsersByFile(
    file: File,
  ): Promise<{ success: boolean; message: string }> {
    return this.userRepository.createUsersByFile(file);
  }

  async resetPassword(id: string): Promise<GetUserByIdResponse> {
    return this.userRepository.resetPassword(id);
  }
}
