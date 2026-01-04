import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricalDataController } from './historical.controller';
import { HistoricalDataService } from './historical.service';
import { ConverterSnapshot } from '../../entities/converter-snapshot.entity';
import { BusSnapshot } from '../../entities/bus-snapshot.entity';
import { RESSnapshot } from '../../entities/res-snapshot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConverterSnapshot,
      BusSnapshot,
      RESSnapshot,
    ]),
  ],
  controllers: [HistoricalDataController],
  providers: [HistoricalDataService],
  exports: [HistoricalDataService],
})
export class HistoricalDataModule {}
