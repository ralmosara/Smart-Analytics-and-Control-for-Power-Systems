import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);

  // Global prefix for all routes
  app.setGlobalPrefix(configService.get<string>('API_PREFIX', 'api/v1'));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGINS', 'http://localhost:5173').split(','),
    credentials: true,
  });

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Smart Power Systems API')
    .setDescription('API for Smart Analytics and Control Platform for Power Systems')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('converters', 'Power converter control endpoints')
    .addTag('network', 'Network analysis endpoints')
    .addTag('res', 'Renewable energy forecasting endpoints')
    .addTag('reliability', 'Reliability metrics endpoints')
    .addTag('analytics', 'ML analytics endpoints')
    .addTag('optimization', 'Optimization endpoints')
    .addTag('data', 'Data ingestion endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`
  🚀 Application is running on: http://localhost:${port}
  📚 API Documentation: http://localhost:${port}/api
  🔌 WebSocket: http://localhost:${port}
  `);
}
bootstrap();
