import { Injectable, Logger } from '@nestjs/common';

export interface RESData {
  unitId: string;
  type: 'SOLAR' | 'WIND';
  generation: number;
  capacity: number;
  utilizationFactor: number;
  environmentalData: {
    irradiance?: number;
    windSpeed?: number;
    temperature: number;
  };
}

@Injectable()
export class RESSimulator {
  private logger = new Logger('RESSimulator');
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: ((data: RESData[]) => void)[] = [];

  private units = [
    { id: 'SOLAR-001', type: 'SOLAR' as const, capacity: 100 },
    { id: 'SOLAR-002', type: 'SOLAR' as const, capacity: 250 },
    { id: 'WIND-001', type: 'WIND' as const, capacity: 150 },
    { id: 'WIND-002', type: 'WIND' as const, capacity: 300 },
  ];

  start(intervalMs: number = 2000) {
    if (this.isRunning) {
      this.logger.warn('RES simulator is already running');
      return;
    }

    this.logger.log(`Starting RES simulator with ${intervalMs}ms interval`);
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

    this.logger.log('Stopping RES simulator');
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  onData(callback: (data: RESData[]) => void) {
    this.callbacks.push(callback);
  }

  private generateData(): RESData[] {
    const timestamp = Date.now();
    const hour = new Date().getHours();

    return this.units.map((unit) => {
      if (unit.type === 'SOLAR') {
        return this.generateSolarData(unit, timestamp, hour);
      } else {
        return this.generateWindData(unit, timestamp);
      }
    });
  }

  private generateSolarData(unit: any, timestamp: number, hour: number) {
    // Simulate daily solar radiation pattern
    let irradiance = 0;
    if (hour >= 6 && hour <= 18) {
      // Daytime
      const hourAngle = ((hour - 12) / 6) * Math.PI;
      irradiance = 1000 * Math.cos(hourAngle) * Math.cos(hourAngle);
      irradiance += 50 * Math.sin(timestamp / 10000); // Cloud variations
    }

    // Solar panel efficiency (typically 15-20%)
    const efficiency = 0.18;
    const generation = (unit.capacity * irradiance * efficiency) / 1000;

    return {
      unitId: unit.id,
      type: unit.type,
      generation: Math.max(0, generation),
      capacity: unit.capacity,
      utilizationFactor: Math.max(0, generation / unit.capacity),
      environmentalData: {
        irradiance: Math.max(0, irradiance),
        temperature: 25 + 10 * Math.sin(timestamp / 30000),
      },
    };
  }

  private generateWindData(unit: any, timestamp: number) {
    // Simulate wind speed variations
    const baseWindSpeed = 8; // m/s
    const windSpeed =
      baseWindSpeed +
      3 * Math.sin(timestamp / 15000) +
      2 * Math.sin(timestamp / 8000);

    // Wind turbine power curve (simplified)
    let generation = 0;
    const cutIn = 3; // m/s
    const cutOut = 25; // m/s
    const rated = 12; // m/s

    if (windSpeed >= cutIn && windSpeed <= cutOut) {
      if (windSpeed <= rated) {
        // Cubic relationship up to rated speed
        generation = unit.capacity * Math.pow(windSpeed / rated, 3);
      } else {
        // Constant at rated power
        generation = unit.capacity;
      }
    }

    return {
      unitId: unit.id,
      type: unit.type,
      generation: Math.max(0, generation),
      capacity: unit.capacity,
      utilizationFactor: generation / unit.capacity,
      environmentalData: {
        windSpeed: Math.max(0, windSpeed),
        temperature: 15 + 5 * Math.sin(timestamp / 40000),
      },
    };
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      unitCount: this.units.length,
      solarUnits: this.units.filter((u) => u.type === 'SOLAR').length,
      windUnits: this.units.filter((u) => u.type === 'WIND').length,
      subscribers: this.callbacks.length,
    };
  }
}
