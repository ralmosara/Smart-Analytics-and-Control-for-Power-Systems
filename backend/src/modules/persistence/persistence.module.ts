import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConverterSnapshot } from '../../entities/converter-snapshot.entity';
import { BusSnapshot } from '../../entities/bus-snapshot.entity';
import { RESSnapshot } from '../../entities/res-snapshot.entity';
import { PersistenceService } from './persistence.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConverterSnapshot,
      BusSnapshot,
      RESSnapshot,
    ]),
  ],
  providers: [PersistenceService],
  exports: [PersistenceService],
})
export class PersistenceModule {}
