import { Module } from '@nestjs/common';
import { DataIngestionController } from './data-ingestion.controller';
import { DataIngestionService } from './data-ingestion.service';
import { GridSimulator } from './simulators/grid-simulator';
import { ConverterSimulator } from './simulators/converter-simulator';
import { RESSimulator } from './simulators/res-simulator';
import { NotificationsModule } from '../notifications/notifications.module';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [NotificationsModule, PersistenceModule],
  controllers: [DataIngestionController],
  providers: [
    DataIngestionService,
    GridSimulator,
    ConverterSimulator,
    RESSimulator,
  ],
  exports: [DataIngestionService],
})
export class DataIngestionModule {}
