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
exports.DataIngestionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const data_ingestion_service_1 = require("./data-ingestion.service");
let DataIngestionController = class DataIngestionController {
    dataIngestionService;
    constructor(dataIngestionService) {
        this.dataIngestionService = dataIngestionService;
    }
    startSimulation() {
        return this.dataIngestionService.startSimulation();
    }
    stopSimulation() {
        return this.dataIngestionService.stopSimulation();
    }
    getSimulationStatus() {
        return this.dataIngestionService.getSimulationStatus();
    }
};
exports.DataIngestionController = DataIngestionController;
__decorate([
    (0, common_1.Post)('simulation/start'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Start data simulation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Simulation started successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataIngestionController.prototype, "startSimulation", null);
__decorate([
    (0, common_1.Post)('simulation/stop'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Stop data simulation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Simulation stopped successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataIngestionController.prototype, "stopSimulation", null);
__decorate([
    (0, common_1.Get)('simulation/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get simulation status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns simulation status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataIngestionController.prototype, "getSimulationStatus", null);
exports.DataIngestionController = DataIngestionController = __decorate([
    (0, swagger_1.ApiTags)('data'),
    (0, common_1.Controller)('data'),
    __metadata("design:paramtypes", [data_ingestion_service_1.DataIngestionService])
], DataIngestionController);
//# sourceMappingURL=data-ingestion.controller.js.map