import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import {
  REPOSITORY_TOKENS_MAIN,
  REPOSITORY_TOKENS_TENANT,
} from 'src/infra';
import { IUserContractRepository } from 'src/infra/postgres-databases/main/repositories/user/user.contract.repository';
import { IProfileContractRepository } from 'src/infra/postgres-databases/tenant/repositories/profile/profile.contract.repository';
import { UserTenantViewCacheService } from 'src/infra/postgres-databases/tenant/user-tenant-view-cache.service';
import { Role } from 'src/infra/postgres-databases/main/entities/enums';
import { RoleType } from '@global-types/entities/user.entity-type';
import { ITenantUserEntity } from '@global-types/entities/tenant-user.entity-type';
import {
  IGetTenantUsersResponse,
  ICreateTenantUserResponse,
  IUpdateTenantUserResponse,
  IDeleteTenantUserResponse,
} from '@global-types/responses/tenant-user.response';
import {
  CreateTenantUserDto,
  UpdateTenantUserDto,
  GetTenantUsersDto,
} from '../dto/tenant-user.dto';

interface TenantUserRow {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  imageUrl: string | null;
  role: RoleType;
}

@Injectable()
export class TenantUserService {
  constructor(
    @InjectDataSource() private readonly mainDataSource: DataSource,
    @Inject(REPOSITORY_TOKENS_MAIN.USER_REPOSITORY)
    private readonly userRepository: IUserContractRepository,
    @Inject(REPOSITORY_TOKENS_TENANT.PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileContractRepository,
    private readonly userTenantViewCache: UserTenantViewCacheService,
    private readonly cls: ClsService,
  ) {}

  /** Current tenant from the request context (set from the requester's JWT). */
  private getTenantId(): string {
    const tenantId = this.cls.get<string>('tenantId');
    if (!tenantId) {
      throw new BadRequestException(
        'No tenant context. Select a workspace first.',
      );
    }
    return tenantId;
  }

  /** Manage rights: a SaaS admin, or linked to a permitAll profile. */
  private async assertCanManage(
    requesterId: string,
    role: RoleType,
  ): Promise<void> {
    if (role === 'ADMIN') return;
    const profiles =
      await this.profileRepository.getProfilesByUser(requesterId);
    if (!profiles.some((profile) => profile.permitAll)) {
      throw new ForbiddenException(
        'You do not have permission to manage users',
      );
    }
  }

  private async assertUserInTenant(
    userId: string,
    tenantId: string,
  ): Promise<void> {
    const [{ exists }] = await this.mainDataSource.query(
      `SELECT EXISTS(
         SELECT 1 FROM "pivot_relation_user_tenant"
          WHERE "userId" = $1 AND "tenantId" = $2
       ) AS "exists"`,
      [userId, tenantId],
    );
    if (!exists) {
      throw new NotFoundException('User not found in this tenant');
    }
  }

  private async assembleTenantUser(
    userId: string,
  ): Promise<ITenantUserEntity> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const profiles =
      await this.profileRepository.getProfilesByUser(userId);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      imageUrl: user.imageUrl,
      role: user.role,
      profiles: profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        permitAll: profile.permitAll,
      })),
    };
  }

  async getAll(
    params: GetTenantUsersDto,
    requesterId: string,
    role: RoleType,
  ): Promise<IGetTenantUsersResponse> {
    await this.assertCanManage(requesterId, role);
    const tenantId = this.getTenantId();
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = Number(params.pageSize) || 20;
    const search = params.search || '';
    const like = `%${search}%`;

    const rows: TenantUserRow[] = await this.mainDataSource.query(
      `SELECT u."id", u."name", u."email", u."cpf", u."imageUrl", u."role"
         FROM "pivot_relation_user_tenant" p
         JOIN "users" u ON u."id" = p."userId"
        WHERE p."tenantId" = $1 AND u."deletedAt" IS NULL
          AND ($2 = '' OR u."name" ILIKE $3 OR u."email" ILIKE $3)
        ORDER BY u."name" ASC
        LIMIT $4 OFFSET $5`,
      [tenantId, search, like, pageSize, (page - 1) * pageSize],
    );

    const [{ count }] = await this.mainDataSource.query(
      `SELECT COUNT(*)::int AS count
         FROM "pivot_relation_user_tenant" p
         JOIN "users" u ON u."id" = p."userId"
        WHERE p."tenantId" = $1 AND u."deletedAt" IS NULL
          AND ($2 = '' OR u."name" ILIKE $3 OR u."email" ILIKE $3)`,
      [tenantId, search, like],
    );
    const total: number = count;

    const data: ITenantUserEntity[] = await Promise.all(
      rows.map(async (row) => {
        const profiles =
          await this.profileRepository.getProfilesByUser(row.id);
        return {
          ...row,
          profiles: profiles.map((profile) => ({
            id: profile.id,
            name: profile.name,
            permitAll: profile.permitAll,
          })),
        };
      }),
    );

    return {
      data,
      metadata: {
        page,
        total,
        hasNextPage: total > page * pageSize,
        hasPreviousPage: page > 1,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  }

  async create(
    data: CreateTenantUserDto,
    requesterId: string,
    role: RoleType,
  ): Promise<ICreateTenantUserResponse> {
    await this.assertCanManage(requesterId, role);
    const tenantId = this.getTenantId();

    const created = await this.userRepository.createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      cpf: data.cpf,
      role: Role.USER,
    });

    if (!created) {
      throw new BadRequestException('Could not create the user');
    }

    // Link the user to the current tenant and make it their active workspace.
    await this.mainDataSource.query(
      `INSERT INTO "pivot_relation_user_tenant" ("userId", "tenantId", "role")
         VALUES ($1, $2, 'MEMBER') ON CONFLICT DO NOTHING`,
      [created.id, tenantId],
    );
    await this.mainDataSource.query(
      `UPDATE "users" SET "currentTenantViewId" = $1 WHERE "id" = $2`,
      [tenantId, created.id],
    );
    await this.userTenantViewCache.set(created.id, tenantId);

    // Vinculus: link the user to the chosen profiles.
    await this.profileRepository.setUserProfiles(
      created.id,
      data.profileIds,
    );

    return this.assembleTenantUser(created.id);
  }

  async update(
    userId: string,
    data: UpdateTenantUserDto,
    requesterId: string,
    role: RoleType,
  ): Promise<IUpdateTenantUserResponse> {
    await this.assertCanManage(requesterId, role);
    const tenantId = this.getTenantId();
    await this.assertUserInTenant(userId, tenantId);

    const { profileIds, ...userFields } = data;
    if (Object.keys(userFields).length > 0) {
      await this.userRepository.updateUser(userId, userFields);
    }
    if (profileIds !== undefined) {
      await this.profileRepository.setUserProfiles(
        userId,
        profileIds,
      );
    }

    return this.assembleTenantUser(userId);
  }

  async remove(
    userId: string,
    requesterId: string,
    role: RoleType,
  ): Promise<IDeleteTenantUserResponse> {
    await this.assertCanManage(requesterId, role);
    const tenantId = this.getTenantId();
    await this.assertUserInTenant(userId, tenantId);

    // Unlink from the tenant (keep the global user account).
    await this.profileRepository.setUserProfiles(userId, []);
    await this.mainDataSource.query(
      `DELETE FROM "pivot_relation_user_tenant"
         WHERE "userId" = $1 AND "tenantId" = $2`,
      [userId, tenantId],
    );
    await this.mainDataSource.query(
      `UPDATE "users" SET "currentTenantViewId" = NULL
         WHERE "id" = $1 AND "currentTenantViewId" = $2`,
      [userId, tenantId],
    );

    return { success: true, id: userId };
  }
}
