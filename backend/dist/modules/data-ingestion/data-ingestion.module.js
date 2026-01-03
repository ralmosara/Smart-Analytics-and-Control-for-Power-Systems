"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataIngestionModule = void 0;
const common_1 = require("@nestjs/common");
const data_ingestion_controller_1 = require("./data-ingestion.controller");
const data_ingestion_service_1 = require("./data-ingestion.service");
const grid_simulator_1 = require("./simulators/grid-simulator");
const converter_simulator_1 = require("./simulators/converter-simulator");
const res_simulator_1 = require("./simulators/res-simulator");
const notifications_module_1 = require("../notifications/notifications.module");
const persistence_module_1 = require("../persistence/persistence.module");
let DataIngestionModule = class DataIngestionModule {
};
exports.DataIngestionModule = DataIngestionModule;
exports.DataIngestionModule = DataIngestionModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule, persistence_module_1.PersistenceModule],
        controllers: [data_ingestion_controller_1.DataIngestionController],
        providers: [
            data_ingestion_service_1.DataIngestionService,
            grid_simulator_1.GridSimulator,
            converter_simulator_1.ConverterSimulator,
            res_simulator_1.RESSimulator,
        ],
        exports: [data_ingestion_service_1.DataIngestionService],
    })
], DataIngestionModule);
//# sourceMappingURL=data-ingestion.module.js.map