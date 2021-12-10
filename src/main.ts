import { NestFactory } from '@nestjs/core';
import { AppModule } from './App.module';
import { ValidationPipe } from '@nestjs/common';
import { env } from './utils/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, validateCustomDecorators: true }),
  );

  app.enableCors({ origin: '*' });

  await app.listen(env.APP_PORT, env.APP_HOST);
}
bootstrap();
