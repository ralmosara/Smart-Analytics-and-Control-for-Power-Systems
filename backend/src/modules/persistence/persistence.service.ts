import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConverterSnapshot } from '../../entities/converter-snapshot.entity';
import { BusSnapshot } from '../../entities/bus-snapshot.entity';
import { RESSnapshot } from '../../entities/res-snapshot.entity';
import type { ConverterData } from '../data-ingestion/simulators/converter-simulator';
import type { BusData } from '../data-ingestion/simulators/grid-simulator';
import type { RESData } from '../data-ingestion/simulators/res-simulator';

@Injectable()
export class PersistenceService implements OnModuleDestroy {
  private readonly logger = new Logger(PersistenceService.name);

  // Buffers for batch writing
  private converterBuffer: ConverterSnapshot[] = [];
  private busBuffer: BusSnapshot[] = [];
  private resBuffer: RESSnapshot[] = [];

  // Configuration
  private readonly BATCH_SIZE = 100;
  private readonly FLUSH_INTERVAL_MS = 1000;
  private flushIntervalId: NodeJS.Timeout | null = null;

  constructor(
    @InjectRepository(ConverterSnapshot)
    private converterRepo: Repository<ConverterSnapshot>,
    @InjectRepository(BusSnapshot)
    private busRepo: Repository<BusSnapshot>,
    @InjectRepository(RESSnapshot)
    private resRepo: Repository<RESSnapshot>,
  ) {
    this.startBatchProcessor();
  }

  onModuleDestroy() {
    this.stopBatchProcessor();
    // Final flush on shutdown
    this.flushAllBuffers().catch((err) =>
      this.logger.error(`Error flushing buffers on shutdown: ${err.message}`),
    );
  }

  /**
   * Queue converter data for batch insertion
   */
  async queueConverterData(data: ConverterData): Promise<void> {
    const snapshot = new ConverterSnapshot();
    snapshot.converterId = data.converterId;
    snapshot.timestamp = new Date();
    snapshot.type = this.getConverterType(data.converterId);
    snapshot.voltage = data.voltage;
    snapshot.currentD = data.current_d;
    snapshot.currentQ = data.current_q;
    snapshot.activePower = data.activePower;
    snapshot.reactivePower = data.reactivePower;
    snapshot.frequency = data.frequency;
    snapshot.thd = data.thd;
    snapshot.temperature = data.temperature;

    this.converterBuffer.push(snapshot);

    if (this.converterBuffer.length >= this.BATCH_SIZE) {
      await this.flushConverterBuffer();
    }
  }

  /**
   * Queue bus data for batch insertion
   */
  async queueBusData(data: BusData): Promise<void> {
    const snapshot = new BusSnapshot();
    snapshot.busId = data.busId;
    snapshot.timestamp = new Date();
    snapshot.voltageMagnitude = data.voltageMagnitude;
    snapshot.voltageAngle = data.voltageAngle;
    snapshot.frequency = data.frequency;
    snapshot.activePower = data.activePower;
    snapshot.reactivePower = data.reactivePower;

    this.busBuffer.push(snapshot);

    if (this.busBuffer.length >= this.BATCH_SIZE) {
      await this.flushBusBuffer();
    }
  }

  /**
   * Queue RES data for batch insertion
   */
  async queueRESData(data: RESData): Promise<void> {
    const snapshot = new RESSnapshot();
    snapshot.unitId = data.unitId;
    snapshot.timestamp = new Date();
    snapshot.type = data.type;
    snapshot.generation = data.generation;
    snapshot.capacity = data.capacity;
    snapshot.utilizationFactor = data.utilizationFactor;
    snapshot.irradiance = data.environmentalData.irradiance ?? null;
    snapshot.windSpeed = data.environmentalData.windSpeed ?? null;
    snapshot.temperature = data.environmentalData.temperature;

    this.resBuffer.push(snapshot);

    if (this.resBuffer.length >= this.BATCH_SIZE) {
      await this.flushRESBuffer();
    }
  }

  /**
   * Flush converter buffer to database
   */
  private async flushConverterBuffer(): Promise<void> {
    if (this.converterBuffer.length === 0) return;

    const batch = [...this.converterBuffer];
    this.converterBuffer = [];

    try {
      await this.converterRepo
        .createQueryBuilder()
        .insert()
        .into(ConverterSnapshot)
        .values(batch)
        .execute();

      this.logger.debug(`Flushed ${batch.length} converter snapshots`);
    } catch (error) {
      this.logger.error(
        `Failed to flush converter buffer: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Flush bus buffer to database
   */
  private async flushBusBuffer(): Promise<void> {
    if (this.busBuffer.length === 0) return;

    const batch = [...this.busBuffer];
    this.busBuffer = [];

    try {
      await this.busRepo
        .createQueryBuilder()
        .insert()
        .into(BusSnapshot)
        .values(batch)
        .execute();

      this.logger.debug(`Flushed ${batch.length} bus snapshots`);
    } catch (error) {
      this.logger.error(
        `Failed to flush bus buffer: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Flush RES buffer to database
   */
  private async flushRESBuffer(): Promise<void> {
    if (this.resBuffer.length === 0) return;

    const batch = [...this.resBuffer];
    this.resBuffer = [];

    try {
      await this.resRepo
        .createQueryBuilder()
        .insert()
        .into(RESSnapshot)
        .values(batch)
        .execute();

      this.logger.debug(`Flushed ${batch.length} RES snapshots`);
    } catch (error) {
      this.logger.error(
        `Failed to flush RES buffer: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Flush all buffers
   */
  private async flushAllBuffers(): Promise<void> {
    await Promise.all([
      this.flushConverterBuffer(),
      this.flushBusBuffer(),
      this.flushRESBuffer(),
    ]);
  }

  /**
   * Start the batch processor that flushes buffers periodically
   */
  private startBatchProcessor(): void {
    this.logger.log(
      `Starting batch processor with ${this.FLUSH_INTERVAL_MS}ms interval`,
    );

    this.flushIntervalId = setInterval(() => {
      this.flushAllBuffers().catch((err) =>
        this.logger.error(`Error in batch processor: ${err.message}`),
      );
    }, this.FLUSH_INTERVAL_MS);
  }

  /**
   * Stop the batch processor
   */
  private stopBatchProcessor(): void {
    if (this.flushIntervalId) {
      this.logger.log('Stopping batch processor');
      clearInterval(this.flushIntervalId);
      this.flushIntervalId = null;
    }
  }

  /**
   * Helper to get converter type from ID
   */
  private getConverterType(converterId: string): string {
    if (converterId.includes('001')) return 'TWO_LEVEL';
    if (converterId.includes('002')) return 'NPC';
    if (converterId.includes('003')) return 'BUCK';
    return 'UNKNOWN';
  }

  /**
   * Get buffer statistics
   */
  getStats() {
    return {
      converterBuffer: this.converterBuffer.length,
      busBuffer: this.busBuffer.length,
      resBuffer: this.resBuffer.length,
      batchSize: this.BATCH_SIZE,
      flushInterval: this.FLUSH_INTERVAL_MS,
    };
  }
}
