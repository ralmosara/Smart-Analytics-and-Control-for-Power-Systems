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
exports.RESSnapshot = void 0;
const typeorm_1 = require("typeorm");
let RESSnapshot = class RESSnapshot {
    id;
    unitId;
    timestamp;
    type;
    generation;
    capacity;
    utilizationFactor;
    irradiance;
    windSpeed;
    temperature;
    createdAt;
};
exports.RESSnapshot = RESSnapshot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RESSnapshot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'unit_id' }),
    __metadata("design:type", String)
], RESSnapshot.prototype, "unitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], RESSnapshot.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], RESSnapshot.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], RESSnapshot.prototype, "generation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], RESSnapshot.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 4, name: 'utilization_factor' }),
    __metadata("design:type", Number)
], RESSnapshot.prototype, "utilizationFactor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], RESSnapshot.prototype, "irradiance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'wind_speed' }),
    __metadata("design:type", Object)
], RESSnapshot.prototype, "windSpeed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], RESSnapshot.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RESSnapshot.prototype, "createdAt", void 0);
exports.RESSnapshot = RESSnapshot = __decorate([
    (0, typeorm_1.Entity)('res_snapshots'),
    (0, typeorm_1.Index)(['unitId', 'timestamp']),
    (0, typeorm_1.Index)(['type', 'timestamp']),
    (0, typeorm_1.Index)(['timestamp'])
], RESSnapshot);
//# sourceMappingURL=res-snapshot.entity.js.map