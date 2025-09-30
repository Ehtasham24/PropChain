/* eslint-disable unicorn/prefer-module */
import { ConfigModule } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export async function bootstrapApp(app: NestExpressApplication) {

  const config = new DocumentBuilder()
    .setTitle('REAL ESTATE BACKEND APIs')
    .setDescription(
      'SECURELY SELL AND PURCHASE REAL ESTATE PROPERTIES',
    )
    .setVersion('1.0.0')
    .addTag('REAL ESTATE BACKEND APIs')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Bearer Authorization',
    )
    .build();

  const theme = new SwaggerTheme();

  const themeOptions = {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA),
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  await ConfigModule.envVariablesLoaded;

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, themeOptions);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });
}
