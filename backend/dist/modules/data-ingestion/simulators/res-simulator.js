"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESSimulator = void 0;
const common_1 = require("@nestjs/common");
let RESSimulator = class RESSimulator {
    logger = new common_1.Logger('RESSimulator');
    isRunning = false;
    intervalId = null;
    callbacks = [];
    units = [
        { id: 'SOLAR-001', type: 'SOLAR', capacity: 100 },
        { id: 'SOLAR-002', type: 'SOLAR', capacity: 250 },
        { id: 'WIND-001', type: 'WIND', capacity: 150 },
        { id: 'WIND-002', type: 'WIND', capacity: 300 },
    ];
    start(intervalMs = 2000) {
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
    onData(callback) {
        this.callbacks.push(callback);
    }
    generateData() {
        const timestamp = Date.now();
        const hour = new Date().getHours();
        return this.units.map((unit) => {
            if (unit.type === 'SOLAR') {
                return this.generateSolarData(unit, timestamp, hour);
            }
            else {
                return this.generateWindData(unit, timestamp);
            }
        });
    }
    generateSolarData(unit, timestamp, hour) {
        let irradiance = 0;
        if (hour >= 6 && hour <= 18) {
            const hourAngle = ((hour - 12) / 6) * Math.PI;
            irradiance = 1000 * Math.cos(hourAngle) * Math.cos(hourAngle);
            irradiance += 50 * Math.sin(timestamp / 10000);
        }
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
    generateWindData(unit, timestamp) {
        const baseWindSpeed = 8;
        const windSpeed = baseWindSpeed +
            3 * Math.sin(timestamp / 15000) +
            2 * Math.sin(timestamp / 8000);
        let generation = 0;
        const cutIn = 3;
        const cutOut = 25;
        const rated = 12;
        if (windSpeed >= cutIn && windSpeed <= cutOut) {
            if (windSpeed <= rated) {
                generation = unit.capacity * Math.pow(windSpeed / rated, 3);
            }
            else {
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
};
exports.RESSimulator = RESSimulator;
exports.RESSimulator = RESSimulator = __decorate([
    (0, common_1.Injectable)()
], RESSimulator);
//# sourceMappingURL=res-simulator.js.map