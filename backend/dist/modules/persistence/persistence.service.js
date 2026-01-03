"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PersistenceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const converter_snapshot_entity_1 = require("../../entities/converter-snapshot.entity");
const bus_snapshot_entity_1 = require("../../entities/bus-snapshot.entity");
const res_snapshot_entity_1 = require("../../entities/res-snapshot.entity");
let PersistenceService = PersistenceService_1 = class PersistenceService {
    converterRepo;
    busRepo;
    resRepo;
    logger = new common_1.Logger(PersistenceService_1.name);
    converterBuffer = [];
    busBuffer = [];
    resBuffer = [];
    BATCH_SIZE = 100;
    FLUSH_INTERVAL_MS = 1000;
    flushIntervalId = null;
    constructor(converterRepo, busRepo, resRepo) {
        this.converterRepo = converterRepo;
        this.busRepo = busRepo;
        this.resRepo = resRepo;
        this.startBatchProcessor();
    }
    onModuleDestroy() {
        this.stopBatchProcessor();
        this.flushAllBuffers().catch((err) => this.logger.error(`Error flushing buffers on shutdown: ${err.message}`));
    }
    async queueConverterData(data) {
        const snapshot = new converter_snapshot_entity_1.ConverterSnapshot();
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
    async queueBusData(data) {
        const snapshot = new bus_snapshot_entity_1.BusSnapshot();
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
    async queueRESData(data) {
        const snapshot = new res_snapshot_entity_1.RESSnapshot();
        snapshot.unitId = data.unitId;
        snapshot.timestamp = new Date();
        snapshot.type = data.type;
        snapshot.generation = data.generation;
        snapshot.capacity = data.capacity;
        snapshot.utilizationFactor = data.utilizationFactor;
        snapshot.irradiance = data.environmentalData.irradiance || null;
        snapshot.windSpeed = data.environmentalData.windSpeed || null;
        snapshot.temperature = data.environmentalData.temperature;
        this.resBuffer.push(snapshot);
        if (this.resBuffer.length >= this.BATCH_SIZE) {
            await this.flushRESBuffer();
        }
    }
    async flushConverterBuffer() {
        if (this.converterBuffer.length === 0)
            return;
        const batch = [...this.converterBuffer];
        this.converterBuffer = [];
        try {
            await this.converterRepo
                .createQueryBuilder()
                .insert()
                .into(converter_snapshot_entity_1.ConverterSnapshot)
                .values(batch)
                .execute();
            this.logger.debug(`Flushed ${batch.length} converter snapshots`);
        }
        catch (error) {
            this.logger.error(`Failed to flush converter buffer: ${error.message}`, error.stack);
        }
    }
    async flushBusBuffer() {
        if (this.busBuffer.length === 0)
            return;
        const batch = [...this.busBuffer];
        this.busBuffer = [];
        try {
            await this.busRepo
                .createQueryBuilder()
                .insert()
                .into(bus_snapshot_entity_1.BusSnapshot)
                .values(batch)
                .execute();
            this.logger.debug(`Flushed ${batch.length} bus snapshots`);
        }
        catch (error) {
            this.logger.error(`Failed to flush bus buffer: ${error.message}`, error.stack);
        }
    }
    async flushRESBuffer() {
        if (this.resBuffer.length === 0)
            return;
        const batch = [...this.resBuffer];
        this.resBuffer = [];
        try {
            await this.resRepo
                .createQueryBuilder()
                .insert()
                .into(res_snapshot_entity_1.RESSnapshot)
                .values(batch)
                .execute();
            this.logger.debug(`Flushed ${batch.length} RES snapshots`);
        }
        catch (error) {
            this.logger.error(`Failed to flush RES buffer: ${error.message}`, error.stack);
        }
    }
    async flushAllBuffers() {
        await Promise.all([
            this.flushConverterBuffer(),
            this.flushBusBuffer(),
            this.flushRESBuffer(),
        ]);
    }
    startBatchProcessor() {
        this.logger.log(`Starting batch processor with ${this.FLUSH_INTERVAL_MS}ms interval`);
        this.flushIntervalId = setInterval(() => {
            this.flushAllBuffers().catch((err) => this.logger.error(`Error in batch processor: ${err.message}`));
        }, this.FLUSH_INTERVAL_MS);
    }
    stopBatchProcessor() {
        if (this.flushIntervalId) {
            this.logger.log('Stopping batch processor');
            clearInterval(this.flushIntervalId);
            this.flushIntervalId = null;
        }
    }
    getConverterType(converterId) {
        if (converterId.includes('001'))
            return 'TWO_LEVEL';
        if (converterId.includes('002'))
            return 'NPC';
        if (converterId.includes('003'))
            return 'BUCK';
        return 'UNKNOWN';
    }
    getStats() {
        return {
            converterBuffer: this.converterBuffer.length,
            busBuffer: this.busBuffer.length,
            resBuffer: this.resBuffer.length,
            batchSize: this.BATCH_SIZE,
            flushInterval: this.FLUSH_INTERVAL_MS,
        };
    }
};
exports.PersistenceService = PersistenceService;
exports.PersistenceService = PersistenceService = PersistenceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(converter_snapshot_entity_1.ConverterSnapshot)),
    __param(1, (0, typeorm_1.InjectRepository)(bus_snapshot_entity_1.BusSnapshot)),
    __param(2, (0, typeorm_1.InjectRepository)(res_snapshot_entity_1.RESSnapshot)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PersistenceService);
//# sourceMappingURL=persistence.service.js.map