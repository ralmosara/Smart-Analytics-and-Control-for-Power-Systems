"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const converter_snapshot_entity_1 = require("../../entities/converter-snapshot.entity");
const bus_snapshot_entity_1 = require("../../entities/bus-snapshot.entity");
const res_snapshot_entity_1 = require("../../entities/res-snapshot.entity");
const persistence_service_1 = require("./persistence.service");
let PersistenceModule = class PersistenceModule {
};
exports.PersistenceModule = PersistenceModule;
exports.PersistenceModule = PersistenceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                converter_snapshot_entity_1.ConverterSnapshot,
                bus_snapshot_entity_1.BusSnapshot,
                res_snapshot_entity_1.RESSnapshot,
            ]),
        ],
        providers: [persistence_service_1.PersistenceService],
        exports: [persistence_service_1.PersistenceService],
    })
], PersistenceModule);
//# sourceMappingURL=persistence.module.js.map