import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { configuration, rootPath } from 'src/config/config';
import * as path from 'path';
import { StatusLoggerService } from './status-logger.service';
import { StorageModule } from 'src/infra/storage';
import { RedisCacheModule } from 'src/infra/redis';
import { CommonModule } from './modules/common/common.module';
import { FileModule } from './modules/file/file.module';
import { ClsModule } from 'nestjs-cls';
import { PostgresDatabaseModule } from './infra/postgres-databases/postgres-database.module';
import { TenantClsSetupService } from './infra/postgres-databases/tenant/tenant-cls-setup.service';
import { SocketModule } from './modules/socket/socket.module';
import { StartUserTenantModule } from './modules/start-user-tenant/start-user-tenant.module';
import { MailModule } from './modules/mail/mail.module';
import { SeedModule } from './modules/seed/seed.module';
import { EnterpriseModule } from './modules/enterprise/enterprise.module';
import { EnterpriseMemberModule } from './modules/enterprise-member/enterprise-member.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PublicResolverModule } from './modules/public-resolver/public-resolver.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // config.ts already loads root .env (without variable expansion).
      // Nest's default expandVariables breaks keys like ASAAS_API_KEY=$aact_...
      ignoreEnvFile: true,
      expandVariables: false,
      load: [configuration],
      envFilePath: path.resolve(rootPath, '.env'),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    RedisCacheModule,
    PostgresDatabaseModule,
    ClsModule.forRootAsync({
      global: true,
      imports: [PostgresDatabaseModule],
      useFactory: (tenantClsSetup: TenantClsSetupService) => ({
        middleware: {
          mount: true,
          setup: async (cls, req, _res) => {
            await tenantClsSetup.applyTenantFromJwt(cls, req);
          },
        },
      }),
      inject: [TenantClsSetupService],
    }),
    StorageModule,
    CommonModule,
    UserModule,
    AuthModule,
    EnterpriseModule,
    EnterpriseMemberModule,
    ProfileModule,

    PublicResolverModule,

    SeedModule,
    FastifyMulterModule,
    MailModule,
    FileModule,
    SocketModule,
    StartUserTenantModule,
  ],
  controllers: [AppController],
  providers: [AppService, StatusLoggerService],
})
export class AppModule {}
