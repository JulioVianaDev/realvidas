import { Global, Module, Scope } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { EntityManager } from 'typeorm';
import { getTenantConnection } from './utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantClsSetupService } from './tenant-cls-setup.service';
import { UserTenantViewCacheService } from './user-tenant-view-cache.service';
import { EnterpriseEntity } from './entities/enterprise.entity';
import { EnterpriseMemberEntity } from './entities/enterprise-member.entity';
import { EnterpriseInvitationEntity } from './entities/enterprise-invitation.entity';
import { FileEntity } from './entities/file.entity';
import { ProfileEntity } from './entities/profile.entity';
import { UserProfilePivotEntity } from './entities/pivot/user-profile.pivot.entity';

/** Inject this token to get the current tenant's EntityManager (null if no tenant in context). */
export const TENANT_CONNECTION = Symbol('TENANT_CONNECTION');

const connectionFactory = {
  provide: TENANT_CONNECTION,
  scope: Scope.REQUEST,
  useFactory: async (
    cls: ClsService,
  ): Promise<EntityManager | null> => {
    const tenantId = cls.get<string>('tenantId');
    if (!tenantId) return null;

    const connection = await getTenantConnection(tenantId);
    // Use the default manager — do not create a QueryRunner per request without
    // releasing it; that holds pool connections until timeout (poolSize is small).
    return connection.manager;
  },
  inject: [ClsService],
};

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '10h' },
      }),
    }),
    TypeOrmModule.forFeature([
      EnterpriseEntity,
      EnterpriseMemberEntity,
      EnterpriseInvitationEntity,
      FileEntity,
      ProfileEntity,
      UserProfilePivotEntity,
    ]),
  ],
  providers: [
    connectionFactory,
    TenantClsSetupService,
    UserTenantViewCacheService,
  ],
  exports: [
    TENANT_CONNECTION,
    TenantClsSetupService,
    UserTenantViewCacheService,
  ],
})
export class TenancyModule {}
