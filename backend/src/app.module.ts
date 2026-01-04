import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DataIngestionModule } from './modules/data-ingestion/data-ingestion.module';
import { PersistenceModule } from './modules/persistence/persistence.module';
import { SeederModule } from './database/seeders/seeder.module';
import { HistoricalDataModule } from './modules/historical/historical.module';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),

    // Job Queue
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
      }),
    }),

    // Feature modules
    NotificationsModule,
    PersistenceModule,
    DataIngestionModule,
    SeederModule,
    HistoricalDataModule,

    // More modules will be added here as we build them
    // AuthModule,
    // ConvertersModule,
    // NetworkAnalysisModule,
    // etc.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
