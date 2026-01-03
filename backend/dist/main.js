"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
    });
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix(configService.get('API_PREFIX', 'api/v1'));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors({
        origin: configService.get('CORS_ORIGINS', 'http://localhost:5173').split(','),
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.log(`
  🚀 Application is running on: http://localhost:${port}
  📚 API Documentation: http://localhost:${port}/api
  🔌 WebSocket: http://localhost:${port}
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map