import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
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
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
