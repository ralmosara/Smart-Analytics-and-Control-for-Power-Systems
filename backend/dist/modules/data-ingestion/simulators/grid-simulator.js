"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridSimulator = void 0;
const common_1 = require("@nestjs/common");
let GridSimulator = class GridSimulator {
    logger = new common_1.Logger('GridSimulator');
    isRunning = false;
    intervalId = null;
    callbacks = [];
    buses = [
        { id: 'BUS-001', baseVoltage: 220, type: 'SLACK' },
        { id: 'BUS-002', baseVoltage: 220, type: 'PV' },
        { id: 'BUS-003', baseVoltage: 220, type: 'PQ' },
        { id: 'BUS-004', baseVoltage: 110, type: 'PQ' },
        { id: 'BUS-005', baseVoltage: 110, type: 'PQ' },
    ];
    start(intervalMs = 1000) {
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
    onData(callback) {
        this.callbacks.push(callback);
    }
    generateData() {
        const timestamp = Date.now();
        const frequencyBase = 50;
        const frequencyVariation = 0.05 * Math.sin(timestamp / 10000);
        return this.buses.map((bus, index) => {
            const voltageVariation = 0.02 * Math.sin(timestamp / 5000 + index);
            const angleVariation = 5 * Math.sin(timestamp / 8000 + index);
            const powerVariation = 10 * Math.sin(timestamp / 12000 + index);
            return {
                busId: bus.id,
                voltageMagnitude: 1.0 + voltageVariation,
                voltageAngle: -10 + angleVariation + index * 5,
                frequency: frequencyBase + frequencyVariation,
                activePower: 50 + powerVariation + index * 20,
                reactivePower: 10 + powerVariation * 0.3 + index * 5,
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
};
exports.GridSimulator = GridSimulator;
exports.GridSimulator = GridSimulator = __decorate([
    (0, common_1.Injectable)()
], GridSimulator);
//# sourceMappingURL=grid-simulator.js.map