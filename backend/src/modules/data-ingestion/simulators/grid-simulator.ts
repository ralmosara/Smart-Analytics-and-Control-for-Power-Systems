import { Injectable, Logger } from '@nestjs/common';

export interface BusData {
  busId: string;
  voltageMagnitude: number;
  voltageAngle: number;
  frequency: number;
  activePower: number;
  reactivePower: number;
}

@Injectable()
export class GridSimulator {
  private logger = new Logger('GridSimulator');
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: ((data: BusData[]) => void)[] = [];

  // Simulate a 5-bus power system
  private buses = [
    { id: 'BUS-001', baseVoltage: 220, type: 'SLACK' },
    { id: 'BUS-002', baseVoltage: 220, type: 'PV' },
    { id: 'BUS-003', baseVoltage: 220, type: 'PQ' },
    { id: 'BUS-004', baseVoltage: 110, type: 'PQ' },
    { id: 'BUS-005', baseVoltage: 110, type: 'PQ' },
  ];

  start(intervalMs: number = 1000) {
    if (this.isRunning) {
      this.logger.warn('Grid simulator is already running');
      return;
    }

    this.logger.log(`Starting grid simulator with ${intervalMs}ms interval`);
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      const data = this.generateData();
      this.callbacks.forEach((callback) => callback(data));
    }, intervalMs);
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.logger.log('Stopping grid simulator');
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  onData(callback: (data: BusData[]) => void) {
    this.callbacks.push(callback);
  }

  private generateData(): BusData[] {
    const timestamp = Date.now();
    const frequencyBase = 50; // 50 Hz
    const frequencyVariation = 0.05 * Math.sin(timestamp / 10000);

    return this.buses.map((bus, index) => {
      // Add realistic variations
      const voltageVariation = 0.02 * Math.sin(timestamp / 5000 + index);
      const angleVariation = 5 * Math.sin(timestamp / 8000 + index);
      const powerVariation = 10 * Math.sin(timestamp / 12000 + index);

      return {
        busId: bus.id,
        voltageMagnitude: 1.0 + voltageVariation, // per unit
        voltageAngle: -10 + angleVariation + index * 5, // degrees
        frequency: frequencyBase + frequencyVariation,
        activePower: 50 + powerVariation + index * 20, // MW
        reactivePower: 10 + powerVariation * 0.3 + index * 5, // MVAR
      };
    });
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      busCount: this.buses.length,
      subscribers: this.callbacks.length,
    };
  }
}
