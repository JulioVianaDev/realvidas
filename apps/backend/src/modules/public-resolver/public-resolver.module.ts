import { Module } from '@nestjs/common';
import { PublicResolverService } from './public-resolver.service';
import { PublicResolverController } from './public-resolver.controller';

@Module({
  providers: [PublicResolverService],
  controllers: [PublicResolverController],
  exports: [PublicResolverService],
})
export class PublicResolverModule {}
