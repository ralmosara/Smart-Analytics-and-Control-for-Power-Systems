import { Injectable, Logger } from '@nestjs/common';

export interface ConverterData {
  converterId: string;
  voltage: number;
  current_d: number;
  current_q: number;
  activePower: number;
  reactivePower: number;
  frequency: number;
  thd: number;
  temperature: number;
}

@Injectable()
export class ConverterSimulator {
  private logger = new Logger('ConverterSimulator');
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: ((data: ConverterData[]) => void)[] = [];

  private converters = [
    { id: 'CONV-001', type: 'TWO_LEVEL', ratedPower: 100 },
    { id: 'CONV-002', type: 'NPC', ratedPower: 250 },
    { id: 'CONV-003', type: 'BUCK', ratedPower: 50 },
  ];

  start(intervalMs: number = 500) {
    if (this.isRunning) {
      this.logger.warn('Converter simulator is already running');
      return;
    }

    this.logger.log(`Starting converter simulator with ${intervalMs}ms interval`);
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

    this.logger.log('Stopping converter simulator');
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  onData(callback: (data: ConverterData[]) => void) {
    this.callbacks.push(callback);
  }

  private generateData(): ConverterData[] {
    const timestamp = Date.now();

    return this.converters.map((converter, index) => {
      // Simulate control loop operation with PI controller
      const setpoint = 1.0;
      const error = 0.05 * Math.sin(timestamp / 3000 + index);

      // d-q current components (vector control)
      const i_d = 50 + 5 * Math.sin(timestamp / 2000 + index); // Active current
      const i_q = 10 + 2 * Math.sin(timestamp / 2500 + index); // Reactive current

      // DC-link voltage
      const v_dc = 650 + 10 * Math.sin(timestamp / 4000 + index);

      // Power calculations
      const p = (i_d * v_dc * 1.5) / 1000; // kW
      const q = (i_q * v_dc * 1.5) / 1000; // kVAR

      // THD varies slightly around 2-3%
      const thd = 2.5 + 0.5 * Math.sin(timestamp / 5000 + index);

      // Temperature slowly increases/decreases
      const temp = 45 + 5 * Math.sin(timestamp / 20000 + index);

      return {
        converterId: converter.id,
        voltage: v_dc,
        current_d: i_d,
        current_q: i_q,
        activePower: p,
        reactivePower: q,
        frequency: 50 + 0.02 * Math.sin(timestamp / 8000),
        thd,
        temperature: temp,
      };
    });
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      converterCount: this.converters.length,
      subscribers: this.callbacks.length,
    };
  }
}
