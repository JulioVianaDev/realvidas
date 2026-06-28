import { Module } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';

/**
 * Manages permission profiles (named roles) and their links to users. The
 * tenant-scoped PROFILE_REPOSITORY is provided globally by
 * PostgresDatabaseModule.
 */
@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
