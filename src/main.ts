import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const configService = app.get(ConfigService);

  app.useLogger(logger);
  app.use(cookieParser(configService.get('COOKIE_SECRET')));

  const config = new DocumentBuilder()
    .setTitle('Vilux App')
    .setDescription('Legit Check')
    .setVersion('1.0.0')
    .addTag('auth')
    .addTag('legit-check')
    .addTag('order')
    .addTag('file')
    .addTag('brand')
    .addTag('category')
    .addTag('subcategory')
    .addTag('subcategory instruction')
    .addTag('service')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT'));
}

bootstrap();
