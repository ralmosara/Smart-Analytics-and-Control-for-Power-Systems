import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConverterSnapshot } from '../../entities/converter-snapshot.entity';
import { BusSnapshot } from '../../entities/bus-snapshot.entity';
import { RESSnapshot } from '../../entities/res-snapshot.entity';

@Injectable()
export class HistoricalDataService {
  private readonly logger = new Logger(HistoricalDataService.name);

  constructor(
    @InjectRepository(ConverterSnapshot)
    private converterRepo: Repository<ConverterSnapshot>,
    @InjectRepository(BusSnapshot)
    private busRepo: Repository<BusSnapshot>,
    @InjectRepository(RESSnapshot)
    private resRepo: Repository<RESSnapshot>,
  ) {}

  /**
   * Get historical data for a specific converter
   */
  async getConverterHistory(
    converterId: string,
    startTime: Date,
    endTime: Date,
    aggregation: string = 'raw',
    limit: number = 1000,
  ): Promise<any[]> {
    this.logger.debug(
      `Fetching converter history: ${converterId}, ${startTime.toISOString()} to ${endTime.toISOString()}, aggregation: ${aggregation}`,
    );

    if (aggregation === 'raw') {
      // Return raw data without aggregation
      const query = this.converterRepo
        .createQueryBuilder('c')
        .where('c.converterId = :converterId', { converterId })
        .andWhere('c.timestamp >= :startTime', { startTime })
        .andWhere('c.timestamp <= :endTime', { endTime })
        .orderBy('c.timestamp', 'DESC')
        .limit(limit);

      return query.getMany();
    } else {
      // Use TimescaleDB time_bucket for aggregation
      const interval = this.getTimeInterval(aggregation);

      const result = await this.converterRepo
        .createQueryBuilder('c')
        .select('time_bucket(:interval, c.timestamp)', 'bucket')
        .addSelect('AVG(c.voltage)', 'avg_voltage')
        .addSelect('AVG(c.currentD)', 'avg_current_d')
        .addSelect('AVG(c.currentQ)', 'avg_current_q')
        .addSelect('AVG(c.activePower)', 'avg_active_power')
        .addSelect('AVG(c.reactivePower)', 'avg_reactive_power')
        .addSelect('AVG(c.frequency)', 'avg_frequency')
        .addSelect('AVG(c.thd)', 'avg_thd')
        .addSelect('AVG(c.temperature)', 'avg_temperature')
        .addSelect('MIN(c.voltage)', 'min_voltage')
        .addSelect('MAX(c.voltage)', 'max_voltage')
        .addSelect('MIN(c.activePower)', 'min_active_power')
        .addSelect('MAX(c.activePower)', 'max_active_power')
        .addSelect('COUNT(*)', 'sample_count')
        .where('c.converterId = :converterId', { converterId })
        .andWhere('c.timestamp >= :startTime', { startTime })
        .andWhere('c.timestamp <= :endTime', { endTime })
        .setParameter('interval', interval)
        .groupBy('bucket')
        .orderBy('bucket', 'DESC')
        .limit(limit)
        .getRawMany();

      return result;
    }
  }

  /**
   * Get historical data for a specific bus
   */
  async getBusHistory(
    busId: string,
    startTime: Date,
    endTime: Date,
    aggregation: string = 'raw',
    limit: number = 1000,
  ): Promise<any[]> {
    this.logger.debug(
      `Fetching bus history: ${busId}, ${startTime.toISOString()} to ${endTime.toISOString()}, aggregation: ${aggregation}`,
    );

    if (aggregation === 'raw') {
      const query = this.busRepo
        .createQueryBuilder('b')
        .where('b.busId = :busId', { busId })
        .andWhere('b.timestamp >= :startTime', { startTime })
        .andWhere('b.timestamp <= :endTime', { endTime })
        .orderBy('b.timestamp', 'DESC')
        .limit(limit);

      return query.getMany();
    } else {
      const interval = this.getTimeInterval(aggregation);

      const result = await this.busRepo
        .createQueryBuilder('b')
        .select('time_bucket(:interval, b.timestamp)', 'bucket')
        .addSelect('AVG(b.voltageMagnitude)', 'avg_voltage_magnitude')
        .addSelect('AVG(b.voltageAngle)', 'avg_voltage_angle')
        .addSelect('AVG(b.frequency)', 'avg_frequency')
        .addSelect('AVG(b.activePower)', 'avg_active_power')
        .addSelect('AVG(b.reactivePower)', 'avg_reactive_power')
        .addSelect('MIN(b.voltageMagnitude)', 'min_voltage_magnitude')
        .addSelect('MAX(b.voltageMagnitude)', 'max_voltage_magnitude')
        .addSelect('MIN(b.activePower)', 'min_active_power')
        .addSelect('MAX(b.activePower)', 'max_active_power')
        .addSelect('COUNT(*)', 'sample_count')
        .where('b.busId = :busId', { busId })
        .andWhere('b.timestamp >= :startTime', { startTime })
        .andWhere('b.timestamp <= :endTime', { endTime })
        .setParameter('interval', interval)
        .groupBy('bucket')
        .orderBy('bucket', 'DESC')
        .limit(limit)
        .getRawMany();

      return result;
    }
  }

  /**
   * Get historical data for a specific RES unit
   */
  async getRESHistory(
    unitId: string,
    startTime: Date,
    endTime: Date,
    aggregation: string = 'raw',
    limit: number = 1000,
  ): Promise<any[]> {
    this.logger.debug(
      `Fetching RES history: ${unitId}, ${startTime.toISOString()} to ${endTime.toISOString()}, aggregation: ${aggregation}`,
    );

    if (aggregation === 'raw') {
      const query = this.resRepo
        .createQueryBuilder('r')
        .where('r.unitId = :unitId', { unitId })
        .andWhere('r.timestamp >= :startTime', { startTime })
        .andWhere('r.timestamp <= :endTime', { endTime })
        .orderBy('r.timestamp', 'DESC')
        .limit(limit);

      return query.getMany();
    } else {
      const interval = this.getTimeInterval(aggregation);

      const result = await this.resRepo
        .createQueryBuilder('r')
        .select('time_bucket(:interval, r.timestamp)', 'bucket')
        .addSelect('AVG(r.generation)', 'avg_generation')
        .addSelect('AVG(r.capacity)', 'avg_capacity')
        .addSelect('AVG(r.utilizationFactor)', 'avg_utilization_factor')
        .addSelect('AVG(r.irradiance)', 'avg_irradiance')
        .addSelect('AVG(r.windSpeed)', 'avg_wind_speed')
        .addSelect('AVG(r.temperature)', 'avg_temperature')
        .addSelect('MIN(r.generation)', 'min_generation')
        .addSelect('MAX(r.generation)', 'max_generation')
        .addSelect('MIN(r.utilizationFactor)', 'min_utilization_factor')
        .addSelect('MAX(r.utilizationFactor)', 'max_utilization_factor')
        .addSelect('COUNT(*)', 'sample_count')
        .where('r.unitId = :unitId', { unitId })
        .andWhere('r.timestamp >= :startTime', { startTime })
        .andWhere('r.timestamp <= :endTime', { endTime })
        .setParameter('interval', interval)
        .groupBy('bucket')
        .orderBy('bucket', 'DESC')
        .limit(limit)
        .getRawMany();

      return result;
    }
  }

  /**
   * Get all available converter IDs
   */
  async getConverterIds(): Promise<string[]> {
    const result = await this.converterRepo
      .createQueryBuilder('c')
      .select('DISTINCT c.converterId', 'converterId')
      .getRawMany();

    return result.map((r) => r.converterId);
  }

  /**
   * Get all available bus IDs
   */
  async getBusIds(): Promise<string[]> {
    const result = await this.busRepo
      .createQueryBuilder('b')
      .select('DISTINCT b.busId', 'busId')
      .getRawMany();

    return result.map((r) => r.busId);
  }

  /**
   * Get all available RES unit IDs
   */
  async getRESIds(): Promise<string[]> {
    const result = await this.resRepo
      .createQueryBuilder('r')
      .select('DISTINCT r.unitId', 'unitId')
      .getRawMany();

    return result.map((r) => r.unitId);
  }

  /**
   * Convert aggregation string to TimescaleDB interval
   */
  private getTimeInterval(aggregation: string): string {
    switch (aggregation) {
      case '1min':
        return '1 minute';
      case '5min':
        return '5 minutes';
      case '1hour':
        return '1 hour';
      default:
        return '1 minute';
    }
  }
}
