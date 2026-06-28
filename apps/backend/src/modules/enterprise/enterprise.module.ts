import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnterpriseService } from './services/enterprise.service';
import { EnterpriseController } from './controllers/enterprise.controller';

@Module({
  imports: [ConfigModule],
  providers: [EnterpriseService],
  controllers: [EnterpriseController],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}
