"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConverterSimulator = void 0;
const common_1 = require("@nestjs/common");
let ConverterSimulator = class ConverterSimulator {
    logger = new common_1.Logger('ConverterSimulator');
    isRunning = false;
    intervalId = null;
    callbacks = [];
    converters = [
        { id: 'CONV-001', type: 'TWO_LEVEL', ratedPower: 100 },
        { id: 'CONV-002', type: 'NPC', ratedPower: 250 },
        { id: 'CONV-003', type: 'BUCK', ratedPower: 50 },
    ];
    start(intervalMs = 500) {
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
    onData(callback) {
        this.callbacks.push(callback);
    }
    generateData() {
        const timestamp = Date.now();
        return this.converters.map((converter, index) => {
            const setpoint = 1.0;
            const error = 0.05 * Math.sin(timestamp / 3000 + index);
            const i_d = 50 + 5 * Math.sin(timestamp / 2000 + index);
            const i_q = 10 + 2 * Math.sin(timestamp / 2500 + index);
            const v_dc = 650 + 10 * Math.sin(timestamp / 4000 + index);
            const p = (i_d * v_dc * 1.5) / 1000;
            const q = (i_q * v_dc * 1.5) / 1000;
            const thd = 2.5 + 0.5 * Math.sin(timestamp / 5000 + index);
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
};
exports.ConverterSimulator = ConverterSimulator;
exports.ConverterSimulator = ConverterSimulator = __decorate([
    (0, common_1.Injectable)()
], ConverterSimulator);
//# sourceMappingURL=converter-simulator.js.map