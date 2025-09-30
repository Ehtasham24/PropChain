import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { bootstrapApp } from './utils/boostrapApp';
import { Logger } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useStaticAssets(join(__dirname, '..', 'src', 'assets'));

  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies, authorization headers, etc.
  });

  bootstrapApp(app);
  app.setGlobalPrefix('v1');

  console.log(process.env.PORT);

  const port: number = Number(process.env.PORT) || 7001;

  await app.listen(port);

  Logger.log(`🚀 Server is up and running on port ${port}`, 'Bootstrap');
}
bootstrap();
