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
exports.BusSnapshot = void 0;
const typeorm_1 = require("typeorm");
let BusSnapshot = class BusSnapshot {
    id;
    busId;
    timestamp;
    voltageMagnitude;
    voltageAngle;
    frequency;
    activePower;
    reactivePower;
    createdAt;
};
exports.BusSnapshot = BusSnapshot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BusSnapshot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'bus_id' }),
    __metadata("design:type", String)
], BusSnapshot.prototype, "busId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], BusSnapshot.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4, name: 'voltage_magnitude' }),
    __metadata("design:type", Number)
], BusSnapshot.prototype, "voltageMagnitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'voltage_angle' }),
    __metadata("design:type", Number)
], BusSnapshot.prototype, "voltageAngle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], BusSnapshot.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'active_power' }),
    __metadata("design:type", Number)
], BusSnapshot.prototype, "activePower", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'reactive_power' }),
    __metadata("design:type", Number)
], BusSnapshot.prototype, "reactivePower", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BusSnapshot.prototype, "createdAt", void 0);
exports.BusSnapshot = BusSnapshot = __decorate([
    (0, typeorm_1.Entity)('bus_snapshots'),
    (0, typeorm_1.Index)(['busId', 'timestamp']),
    (0, typeorm_1.Index)(['timestamp'])
], BusSnapshot);
//# sourceMappingURL=bus-snapshot.entity.js.map