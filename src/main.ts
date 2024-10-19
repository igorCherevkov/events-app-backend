import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function server() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  //   app.enableCors({ origin: configService.get('CLIENT_URL') });
  app.enableCors({ origin: true });
  await app.listen(configService.get('SERVER_PORT'));
}
server();
