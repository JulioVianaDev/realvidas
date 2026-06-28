import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { RedisIoAdapter } from './modules/socket/socket.io.adapter';
import { TransformNestedKeysPipe } from './modules/common/global.pipe';
import path from 'node:path';
import fastifyMulter from 'fastify-multer';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    /** Required for Stripe (and similar) webhook signature verification — see RawBodyRequest. */
    { rawBody: true },
  );
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new TransformNestedKeysPipe(),
    new ValidationPipe({
      transform: true,
    }),
  );
  const redisIoAdapter = new RedisIoAdapter(app, configService);

  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);
  const config = new DocumentBuilder()
    .setTitle('Documentação da api do sistema da flatirons')
    .setDescription(
      'Aqui contém toda a documentação da flatirons, e exemplos de como enviar os dados para a api',
    )
    .addServer('/v1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(
    app,
    config,
  );
  SwaggerModule.setup('/api', app, document);

  const uploadRoot = path.join(
    String(configService.get('rootPath')),
    String(configService.get('upload.folderBase')).replace(/^[/\\]+/, ''),
  );
  app.useStaticAssets({
    root: uploadRoot,
    prefix: '/v1/uploads/',
  });

  app.enableVersioning();
  app.enableCors({
    origin: '*',
  });

  await app.register(fastifyMulter.contentParser);

  const nestPort = configService.get<number>('nestPort', 8080);
  await app.listen(nestPort, '0.0.0.0');
}
bootstrap();