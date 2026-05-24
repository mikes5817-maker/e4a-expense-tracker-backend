import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors({ origin: '*' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // No-cache headers for swagger
  const swaggerPath = 'api-docs';
  app.use(`/${swaggerPath}`, (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('E4A Expense Tracker API')
    .setDescription('Backend API for E4A Solutions Expense Tracking mobile app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'E4A Expense Tracker API',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #0077B6; font-size: 2rem; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 8px; }
      .swagger-ui .opblock-tag { font-size: 1.1rem; border-bottom: 2px solid #0077B6; }
      .swagger-ui .opblock.opblock-post { border-color: #0077B6; background: rgba(0,119,182,0.05); }
      .swagger-ui .opblock.opblock-get { border-color: #2E86AB; background: rgba(46,134,171,0.05); }
      .swagger-ui .btn.execute { background-color: #0077B6; border-color: #0077B6; }
    `,
  });

  await app.listen(3000);
  logger.log('Application running on port 3000');
  logger.log(`Swagger docs at http://localhost:3000/${swaggerPath}`);
}
bootstrap();
