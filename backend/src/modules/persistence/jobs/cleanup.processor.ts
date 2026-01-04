import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ConverterSnapshot } from '../../../entities/converter-snapshot.entity';
import { BusSnapshot } from '../../../entities/bus-snapshot.entity';
import { RESSnapshot } from '../../../entities/res-snapshot.entity';

@Injectable()
export class CleanupProcessor {
  private readonly logger = new Logger(CleanupProcessor.name);
  private readonly retentionDays: number;

  constructor(
    @InjectRepository(ConverterSnapshot)
    private converterRepo: Repository<ConverterSnapshot>,
    @InjectRepository(BusSnapshot)
    private busRepo: Repository<BusSnapshot>,
    @InjectRepository(RESSnapshot)
    private resRepo: Repository<RESSnapshot>,
    private configService: ConfigService,
  ) {
    // Get retention period from environment or default to 7 days
    this.retentionDays = this.configService.get<number>(
      'DATA_RETENTION_DAYS',
      7,
    );
    this.logger.log(
      `Cleanup processor initialized with ${this.retentionDays} days retention policy`,
    );
  }

  /**
   * Daily cleanup job - runs at 2:00 AM every day
   * Removes data older than retention period
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailyCleanup() {
    this.logger.log('Starting daily cleanup job...');

    const startTime = Date.now();
    const cutoffDate = this.getCutoffDate();

    this.logger.log(
      `Deleting records older than ${cutoffDate.toISOString()} (${this.retentionDays} days ago)`,
    );

    try {
      // Delete old converter snapshots
      const converterResult = await this.converterRepo.delete({
        timestamp: LessThan(cutoffDate),
      });

      this.logger.log(
        `Deleted ${converterResult.affected || 0} converter snapshots`,
      );

      // Delete old bus snapshots
      const busResult = await this.busRepo.delete({
        timestamp: LessThan(cutoffDate),
      });

      this.logger.log(`Deleted ${busResult.affected || 0} bus snapshots`);

      // Delete old RES snapshots
      const resResult = await this.resRepo.delete({
        timestamp: LessThan(cutoffDate),
      });

      this.logger.log(`Deleted ${resResult.affected || 0} RES snapshots`);

      const totalDeleted =
        (converterResult.affected || 0) +
        (busResult.affected || 0) +
        (resResult.affected || 0);

      const duration = Date.now() - startTime;

      this.logger.log(
        `Daily cleanup completed: ${totalDeleted.toLocaleString()} total records deleted in ${duration}ms`,
      );
    } catch (error) {
      this.logger.error(`Daily cleanup failed: ${error.message}`, error.stack);
    }
  }

  /**
   * Manual cleanup method - can be called via API or CLI
   */
  async cleanupOldData(daysToRetain?: number): Promise<{
    converters: number;
    buses: number;
    res: number;
    total: number;
  }> {
    const retentionDays = daysToRetain || this.retentionDays;
    const cutoffDate = this.getCutoffDate(retentionDays);

    this.logger.log(
      `Manual cleanup: Deleting records older than ${cutoffDate.toISOString()}`,
    );

    const converterResult = await this.converterRepo.delete({
      timestamp: LessThan(cutoffDate),
    });

    const busResult = await this.busRepo.delete({
      timestamp: LessThan(cutoffDate),
    });

    const resResult = await this.resRepo.delete({
      timestamp: LessThan(cutoffDate),
    });

    const result = {
      converters: converterResult.affected || 0,
      buses: busResult.affected || 0,
      res: resResult.affected || 0,
      total:
        (converterResult.affected || 0) +
        (busResult.affected || 0) +
        (resResult.affected || 0),
    };

    this.logger.log(`Manual cleanup completed: ${JSON.stringify(result)}`);

    return result;
  }

  /**
   * Get statistics on data age distribution
   */
  async getDataAgeStats(): Promise<{
    oldestConverter: Date | null;
    oldestBus: Date | null;
    oldestRES: Date | null;
    cutoffDate: Date;
    retentionDays: number;
  }> {
    // Find oldest records
    const oldestConverter = await this.converterRepo.findOne({
      order: { timestamp: 'ASC' },
      select: ['timestamp'],
    });

    const oldestBus = await this.busRepo.findOne({
      order: { timestamp: 'ASC' },
      select: ['timestamp'],
    });

    const oldestRES = await this.resRepo.findOne({
      order: { timestamp: 'ASC' },
      select: ['timestamp'],
    });

    return {
      oldestConverter: oldestConverter?.timestamp || null,
      oldestBus: oldestBus?.timestamp || null,
      oldestRES: oldestRES?.timestamp || null,
      cutoffDate: this.getCutoffDate(),
      retentionDays: this.retentionDays,
    };
  }

  /**
   * Calculate cutoff date based on retention period
   */
  private getCutoffDate(daysToRetain?: number): Date {
    const days = daysToRetain || this.retentionDays;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return cutoff;
  }

  /**
   * Estimate storage space that could be freed
   */
  async estimateCleanupImpact(): Promise<{
    convertersToDelete: number;
    busesToDelete: number;
    resToDelete: number;
    total: number;
    cutoffDate: Date;
  }> {
    const cutoffDate = this.getCutoffDate();

    const convertersToDelete = await this.converterRepo.count({
      where: { timestamp: LessThan(cutoffDate) },
    });

    const busesToDelete = await this.busRepo.count({
      where: { timestamp: LessThan(cutoffDate) },
    });

    const resToDelete = await this.resRepo.count({
      where: { timestamp: LessThan(cutoffDate) },
    });

    return {
      convertersToDelete,
      busesToDelete,
      resToDelete,
      total: convertersToDelete + busesToDelete + resToDelete,
      cutoffDate,
    };
  }
}
