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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataIngestionService = void 0;
const common_1 = require("@nestjs/common");
const grid_simulator_1 = require("./simulators/grid-simulator");
const converter_simulator_1 = require("./simulators/converter-simulator");
const res_simulator_1 = require("./simulators/res-simulator");
const notifications_service_1 = require("../notifications/notifications.service");
const persistence_service_1 = require("../persistence/persistence.service");
let DataIngestionService = class DataIngestionService {
    gridSimulator;
    converterSimulator;
    resSimulator;
    notificationsService;
    persistenceService;
    logger = new common_1.Logger('DataIngestionService');
    constructor(gridSimulator, converterSimulator, resSimulator, notificationsService, persistenceService) {
        this.gridSimulator = gridSimulator;
        this.converterSimulator = converterSimulator;
        this.resSimulator = resSimulator;
        this.notificationsService = notificationsService;
        this.persistenceService = persistenceService;
        this.setupSimulators();
    }
    setupSimulators() {
        this.gridSimulator.onData((busData) => {
            busData.forEach((data) => {
                this.persistenceService.queueBusData(data).catch((err) => {
                    this.logger.error(`Failed to queue bus data: ${err.message}`);
                });
                this.notificationsService.sendBusUpdate(data.busId, data);
            });
        });
        this.converterSimulator.onData((converterData) => {
            converterData.forEach((data) => {
                this.persistenceService.queueConverterData(data).catch((err) => {
                    this.logger.error(`Failed to queue converter data: ${err.message}`);
                });
                this.notificationsService.sendConverterUpdate(data.converterId, data);
            });
        });
        this.resSimulator.onData((resData) => {
            resData.forEach((data) => {
                this.persistenceService.queueRESData(data).catch((err) => {
                    this.logger.error(`Failed to queue RES data: ${err.message}`);
                });
                this.notificationsService.sendRESUpdate(data.unitId, data.generation);
            });
        });
    }
    startSimulation() {
        this.logger.log('Starting all simulators');
        this.gridSimulator.start(1000);
        this.converterSimulator.start(500);
        this.resSimulator.start(2000);
        this.notificationsService.sendNotification({
            type: 'success',
            title: 'Simulation Started',
            message: 'All simulators are now running',
        });
        return {
            success: true,
            message: 'Simulation started successfully',
            status: this.getSimulationStatus(),
        };
    }
    stopSimulation() {
        this.logger.log('Stopping all simulators');
        this.gridSimulator.stop();
        this.converterSimulator.stop();
        this.resSimulator.stop();
        this.notificationsService.sendNotification({
            type: 'info',
            title: 'Simulation Stopped',
            message: 'All simulators have been stopped',
        });
        return {
            success: true,
            message: 'Simulation stopped successfully',
        };
    }
    getSimulationStatus() {
        return {
            grid: this.gridSimulator.getStatus(),
            converters: this.converterSimulator.getStatus(),
            res: this.resSimulator.getStatus(),
        };
    }
    async processCSVUpload(file) {
        this.logger.log(`Processing CSV file: ${file.originalname}`);
        throw new Error('CSV upload not yet implemented');
    }
    async ingestSCADAData(data) {
        this.logger.log('Ingesting SCADA data');
        throw new Error('SCADA ingestion not yet implemented');
    }
};
exports.DataIngestionService = DataIngestionService;
exports.DataIngestionService = DataIngestionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [grid_simulator_1.GridSimulator,
        converter_simulator_1.ConverterSimulator,
        res_simulator_1.RESSimulator,
        notifications_service_1.NotificationsService,
        persistence_service_1.PersistenceService])
], DataIngestionService);
//# sourceMappingURL=data-ingestion.service.js.map