import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConverterSnapshot } from '../../entities/converter-snapshot.entity';
import { BusSnapshot } from '../../entities/bus-snapshot.entity';
import { RESSnapshot } from '../../entities/res-snapshot.entity';

export interface SeedOptions {
  startTime?: Date;
  endTime?: Date;
  intervalMs?: number;
}

export interface SeedResult {
  converters: number;
  buses: number;
  res: number;
}

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(ConverterSnapshot)
    private converterRepo: Repository<ConverterSnapshot>,
    @InjectRepository(BusSnapshot)
    private busRepo: Repository<BusSnapshot>,
    @InjectRepository(RESSnapshot)
    private resRepo: Repository<RESSnapshot>,
  ) {}

  /**
   * Seed all tables with historical data
   */
  async seedAll(options?: SeedOptions): Promise<SeedResult> {
    const startTime = options?.startTime || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const endTime = options?.endTime || new Date();
    const intervalMs = options?.intervalMs || 5000; // 5 seconds

    this.logger.log(`Starting seeding from ${startTime.toISOString()} to ${endTime.toISOString()}`);
    this.logger.log(`Interval: ${intervalMs}ms (${intervalMs / 1000}s)`);

    const converters = await this.seedConverters(startTime, endTime, intervalMs);
    const buses = await this.seedBuses(startTime, endTime, intervalMs);
    const res = await this.seedRES(startTime, endTime, intervalMs);

    return { converters, buses, res };
  }

  /**
   * Seed converter snapshots
   */
  private async seedConverters(
    start: Date,
    end: Date,
    interval: number,
  ): Promise<number> {
    const converterIds = ['CONV-001', 'CONV-002', 'CONV-003'];
    const types = ['TWO_LEVEL', 'NPC', 'BUCK'];
    const snapshots: ConverterSnapshot[] = [];

    this.logger.log('Generating converter snapshots...');

    for (let ts = start.getTime(); ts <= end.getTime(); ts += interval) {
      converterIds.forEach((id, idx) => {
        const snapshot = new ConverterSnapshot();
        snapshot.converterId = id;
        snapshot.timestamp = new Date(ts);
        snapshot.type = types[idx];

        // Realistic voltage: 380V ± 20V
        snapshot.voltage = 380 + (Math.random() - 0.5) * 40;

        // D-axis current: 10-15A (active power component)
        snapshot.currentD = 10 + Math.random() * 5;

        // Q-axis current: 2-4A (reactive power component)
        snapshot.currentQ = 2 + Math.random() * 2;

        // Power calculations
        snapshot.activePower = snapshot.voltage * snapshot.currentD;
        snapshot.reactivePower = snapshot.voltage * snapshot.currentQ;

        // Grid frequency: 59.95-60.05 Hz
        snapshot.frequency = 59.95 + Math.random() * 0.1;

        // THD: 1-3%
        snapshot.thd = 0.01 + Math.random() * 0.02;

        // Temperature: 40-50°C
        snapshot.temperature = 40 + Math.random() * 10;

        snapshots.push(snapshot);
      });
    }

    this.logger.log(`Generated ${snapshots.length} converter snapshots`);

    // Batch insert in chunks of 1000
    const chunkSize = 1000;
    for (let i = 0; i < snapshots.length; i += chunkSize) {
      const chunk = snapshots.slice(i, i + chunkSize);
      await this.converterRepo
        .createQueryBuilder()
        .insert()
        .into(ConverterSnapshot)
        .values(chunk)
        .execute();

      this.logger.debug(`Inserted converter chunk ${i / chunkSize + 1}/${Math.ceil(snapshots.length / chunkSize)}`);
    }

    return snapshots.length;
  }

  /**
   * Seed bus snapshots
   */
  private async seedBuses(
    start: Date,
    end: Date,
    interval: number,
  ): Promise<number> {
    const busIds = ['BUS-001', 'BUS-002', 'BUS-003', 'BUS-004'];
    const snapshots: BusSnapshot[] = [];

    this.logger.log('Generating bus snapshots...');

    for (let ts = start.getTime(); ts <= end.getTime(); ts += interval) {
      busIds.forEach((id) => {
        const snapshot = new BusSnapshot();
        snapshot.busId = id;
        snapshot.timestamp = new Date(ts);

        // Voltage magnitude: 0.95-1.05 pu (per unit)
        snapshot.voltageMagnitude = 0.95 + Math.random() * 0.1;

        // Voltage angle: -30° to +30°
        snapshot.voltageAngle = -30 + Math.random() * 60;

        // Frequency: 59.95-60.05 Hz
        snapshot.frequency = 59.95 + Math.random() * 0.1;

        // Active power: 100-500 kW
        snapshot.activePower = 100 + Math.random() * 400;

        // Reactive power: -50 to +50 kVAR (can be positive or negative)
        snapshot.reactivePower = -50 + Math.random() * 100;

        snapshots.push(snapshot);
      });
    }

    this.logger.log(`Generated ${snapshots.length} bus snapshots`);

    // Batch insert in chunks of 1000
    const chunkSize = 1000;
    for (let i = 0; i < snapshots.length; i += chunkSize) {
      const chunk = snapshots.slice(i, i + chunkSize);
      await this.busRepo
        .createQueryBuilder()
        .insert()
        .into(BusSnapshot)
        .values(chunk)
        .execute();

      this.logger.debug(`Inserted bus chunk ${i / chunkSize + 1}/${Math.ceil(snapshots.length / chunkSize)}`);
    }

    return snapshots.length;
  }

  /**
   * Seed RES (Renewable Energy Sources) snapshots
   */
  private async seedRES(
    start: Date,
    end: Date,
    interval: number,
  ): Promise<number> {
    const units = [
      { unitId: 'SOLAR-001', type: 'SOLAR' },
      { unitId: 'WIND-001', type: 'WIND' },
    ];
    const snapshots: RESSnapshot[] = [];

    this.logger.log('Generating RES snapshots...');

    for (let ts = start.getTime(); ts <= end.getTime(); ts += interval) {
      units.forEach((unit) => {
        const snapshot = new RESSnapshot();
        snapshot.unitId = unit.unitId;
        snapshot.timestamp = new Date(ts);
        snapshot.type = unit.type;

        // Capacity is fixed
        snapshot.capacity = 100; // 100 kW capacity

        if (unit.type === 'SOLAR') {
          // Solar generation follows daily cycle
          const date = new Date(ts);
          const hourOfDay = date.getHours() + date.getMinutes() / 60;

          // Irradiance follows sine wave (0 at night, peak at noon)
          // Peak around hour 12, zero before 6 and after 18
          if (hourOfDay >= 6 && hourOfDay <= 18) {
            const angle = ((hourOfDay - 6) / 12) * Math.PI;
            snapshot.irradiance = Math.sin(angle) * (800 + Math.random() * 200); // 800-1000 W/m² peak
          } else {
            snapshot.irradiance = 0;
          }

          // Generation based on irradiance (simplified)
          snapshot.generation = (snapshot.irradiance / 1000) * snapshot.capacity;
          snapshot.utilizationFactor = snapshot.generation / snapshot.capacity;

          snapshot.windSpeed = null; // Not applicable for solar
        } else {
          // WIND
          // Wind speed with random variations
          snapshot.windSpeed = 5 + Math.random() * 10; // 5-15 m/s

          // Wind power curve (simplified cubic relationship)
          // Cut-in: 3 m/s, Rated: 12 m/s, Cut-out: 25 m/s
          if (snapshot.windSpeed < 3) {
            snapshot.generation = 0;
          } else if (snapshot.windSpeed >= 3 && snapshot.windSpeed < 12) {
            // Cubic relationship below rated speed
            const normalizedSpeed = (snapshot.windSpeed - 3) / (12 - 3);
            snapshot.generation = snapshot.capacity * Math.pow(normalizedSpeed, 3);
          } else {
            // Rated power
            snapshot.generation = snapshot.capacity;
          }

          snapshot.utilizationFactor = snapshot.generation / snapshot.capacity;
          snapshot.irradiance = null; // Not applicable for wind
        }

        // Temperature: 15-35°C ambient
        snapshot.temperature = 15 + Math.random() * 20;

        snapshots.push(snapshot);
      });
    }

    this.logger.log(`Generated ${snapshots.length} RES snapshots`);

    // Batch insert in chunks of 1000
    const chunkSize = 1000;
    for (let i = 0; i < snapshots.length; i += chunkSize) {
      const chunk = snapshots.slice(i, i + chunkSize);
      await this.resRepo
        .createQueryBuilder()
        .insert()
        .into(RESSnapshot)
        .values(chunk)
        .execute();

      this.logger.debug(`Inserted RES chunk ${i / chunkSize + 1}/${Math.ceil(snapshots.length / chunkSize)}`);
    }

    return snapshots.length;
  }

  /**
   * Clear all seeded data
   */
  async clearAll(): Promise<void> {
    this.logger.log('Clearing all data from snapshot tables...');

    await this.converterRepo.clear();
    await this.busRepo.clear();
    await this.resRepo.clear();

    this.logger.log('All data cleared successfully');
  }
}
