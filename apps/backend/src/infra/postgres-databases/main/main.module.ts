import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mainConfig } from './main.config.orm';
import { TenantEntity } from './entities/tenant.entity';
import { TenantsService } from '../tenant/tenant.service';
import { UserEntity } from './entities/user.entity';
import { UrlShortenerEntity } from './entities/url-shortener.entity';

// data teste
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(mainConfig),
    TypeOrmModule.forFeature([
      TenantEntity,
      UserEntity,
      UrlShortenerEntity,
    ]),
  ],
  providers: [TenantsService],
  exports: [TenantsService, TypeOrmModule],
})
export class MainModule {}
