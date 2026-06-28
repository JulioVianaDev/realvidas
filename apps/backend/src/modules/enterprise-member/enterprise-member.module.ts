import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnterpriseMemberService } from './services/enterprise-member.service';
import { EnterpriseMemberController } from './controllers/enterprise-member.controller';
import { EnterpriseModule } from '../enterprise/enterprise.module';

@Module({
  imports: [ConfigModule, EnterpriseModule],
  providers: [EnterpriseMemberService],
  controllers: [EnterpriseMemberController],
  exports: [EnterpriseMemberService],
})
export class EnterpriseMemberModule {}

