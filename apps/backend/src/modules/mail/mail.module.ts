import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { MailController } from './mail.controller';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';

@Module({
  imports: [
    ConfigModule,
    FastifyMulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: `${configService.get('rootPath')}/${configService.get('upload.folderBase')}`,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
