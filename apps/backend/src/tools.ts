import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const main = async () => {
  const logger = new Logger('Seed');
  let exitCode = 0;

  // Import only after env normalization so DB config reads correct values.
  const { AppModule } = await import('./app.module');
  const { SeedService } = await import(
    './modules/seed/services/seed.service'
  );

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  try {
    await app.init();
    logger.debug('Iniciando Seed');

    const service = app.get(SeedService, {
      strict: false,
    });
    await service.seedAll();

    logger.debug('Seed finalizada com sucesso!');
  } catch (error: any) {
    exitCode = 1;
    logger.error(
      error?.message || 'Erro ao executar seed',
      error?.stack,
    );
  } finally {
    await app.close();
    process.exit(exitCode);
  }
};

main();
