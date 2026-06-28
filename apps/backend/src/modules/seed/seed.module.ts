import { Module } from '@nestjs/common';
import { SeedService } from './services/seed.service';
import { UserModule } from 'src/modules/user/user.module';
import { REPOSITORY_TOKENS_MAIN } from 'src/infra/postgres-databases/main/repository-tokens';
import { UserTypeOrmRepository } from 'src/infra/postgres-databases/main/repositories/user/user.typeorm.repository';
import { PostgresDatabaseModule } from 'src/infra/postgres-databases/postgres-database.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    PostgresDatabaseModule,
    UserModule,
  ],
  providers: [
    SeedService,

    {
      provide: REPOSITORY_TOKENS_MAIN.USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
  ],
  controllers: [],
  exports: [SeedService],
})
export class SeedModule {}
