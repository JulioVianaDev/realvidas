import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TenantsService } from 'src/infra/postgres-databases/tenant/tenant.service';
import { SocketService } from 'src/modules/socket/socket.service';
import { StartUserTenantDto } from '../dto/start-user-tenant.dto';
import { IStartUserTenantResponse } from '@global-types/responses/start-user-tenant.response';
import { getTenantConnection } from 'src/infra/postgres-databases/tenant/utils';
import { EnterpriseEntity } from 'src/infra/postgres-databases/tenant/entities/enterprise.entity';
import { EnterpriseMemberEntity } from 'src/infra/postgres-databases/tenant/entities/enterprise-member.entity';
import { ProfileEntity } from 'src/infra/postgres-databases/tenant/entities/profile.entity';
import { UserProfilePivotEntity } from 'src/infra/postgres-databases/tenant/entities/pivot/user-profile.pivot.entity';
import { UserEntity } from 'src/infra/postgres-databases/main/entities/user.entity';
import { TenantEntity } from 'src/infra/postgres-databases/main/entities/tenant.entity';
import { EnterpriseRole } from 'src/infra/postgres-databases/main/entities/enums';
import { UserTenantViewCacheService } from 'src/infra/postgres-databases/tenant/user-tenant-view-cache.service';

@Injectable()
export class StartUserTenantService {
  private readonly logger = new Logger(StartUserTenantService.name);

  constructor(
    @InjectDataSource() private readonly mainDataSource: DataSource,
    private readonly tenantsService: TenantsService,
    private readonly socketService: SocketService,
    private readonly userTenantViewCache: UserTenantViewCacheService,
  ) {}

  async startUserTenant(
    userId: string,
    payload: StartUserTenantDto,
  ): Promise<IStartUserTenantResponse> {
    const existingTenant =
      await this.tenantsService.findByUserId(userId);
    if (existingTenant) {
      throw new BadRequestException(
        'User already has a tenant. Cannot create another one.',
      );
    }

    const tenant = await this.tenantsService.createTenant(userId);
    this.logger.log(`Tenant ${tenant.id} created for user ${userId}`);

    this.socketService.joinUserToTenantRoom(userId, tenant.id);

    this.provisionTenantInBackground(tenant, userId, payload);

    return {
      tenant: {
        id: tenant.id,
        createdByUserId: tenant.createdByUserId,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      },
      message:
        'Tenant creation started. You will be notified when ready.',
    };
  }

  private async provisionTenantInBackground(
    tenant: TenantEntity,
    userId: string,
    payload: StartUserTenantDto,
  ) {
    try {
      const tenantConnection = await getTenantConnection(tenant.id);
      const enterpriseRepo =
        tenantConnection.getRepository(EnterpriseEntity);
      const memberRepo = tenantConnection.getRepository(
        EnterpriseMemberEntity,
      );

      const enterprise = enterpriseRepo.create({
        name: payload.enterpriseName,
        cpf: payload.cpf || null,
        cnpj: payload.cnpj || null,
        email: payload.email || null,
        timezone: payload.timezone || null,
        ownerId: userId,
      });
      const savedEnterprise = await enterpriseRepo.save(enterprise);

      await memberRepo.save({
        userId,
        enterpriseId: savedEnterprise.id,
        role: EnterpriseRole.OWNER,
      });

      // The owner is the tenant admin: create an "Administrador" permit-all
      // profile and link the owner to it, so they can see every module and
      // manage other users' profiles from the start.
      const profileRepo =
        tenantConnection.getRepository(ProfileEntity);
      const pivotRepo = tenantConnection.getRepository(
        UserProfilePivotEntity,
      );
      const adminProfile = await profileRepo.save({
        name: 'Administrador',
        modules: [],
        permitAll: true,
      });
      await pivotRepo.save({
        userId,
        profileId: adminProfile.id,
      });

      await this.mainDataSource
        .getRepository(UserEntity)
        .update(userId, {
          currentTenantViewId: tenant.id,
        });
      await this.userTenantViewCache.set(userId, tenant.id);

      const pivotTableName = 'pivot_relation_user_tenant';
      await this.mainDataSource.query(
        `INSERT INTO "${pivotTableName}" ("userId", "tenantId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [userId, tenant.id],
      );

      // Emit only to the user room. The creating user's socket is already in
      // both the user room and the tenant room (the startup page joins it), so
      // a tenant-room broadcast as well would deliver tenant:ready twice and
      // trigger duplicate toasts. The user is the only member at provisioning.
      this.socketService.emitToUser(userId, 'tenant:ready', {
        tenantId: tenant.id,
        enterpriseId: savedEnterprise.id,
        enterpriseName: savedEnterprise.name,
      });

      this.logger.log(
        `Tenant ${tenant.id} fully provisioned for user ${userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to provision tenant ${tenant.id}: ${error.message}`,
        error.stack,
      );

      this.socketService.emitToUser(userId, 'tenant:error', {
        tenantId: tenant.id,
        error: 'Failed to provision tenant. Please try again later.',
      });
    }
  }
}
