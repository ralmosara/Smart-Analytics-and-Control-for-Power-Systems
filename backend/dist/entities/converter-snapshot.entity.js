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
exports.ConverterSnapshot = void 0;
const typeorm_1 = require("typeorm");
let ConverterSnapshot = class ConverterSnapshot {
    id;
    converterId;
    timestamp;
    type;
    voltage;
    currentD;
    currentQ;
    activePower;
    reactivePower;
    frequency;
    thd;
    temperature;
    createdAt;
};
exports.ConverterSnapshot = ConverterSnapshot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ConverterSnapshot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'converter_id' }),
    __metadata("design:type", String)
], ConverterSnapshot.prototype, "converterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], ConverterSnapshot.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ConverterSnapshot.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ConverterSnapshot.prototype, "voltage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'current_d' }),
    __metadata("design:type", Number)
], ConverterSnapshot.prototype, "currentD", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'current_q' }),
    __metadata("design:type", Number)
], ConverterSnapshot.prototype, "currentQ", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'active_power' }),
    __metadata("design:type", Number)
], ConverterSnapshot.prototype, "activePower", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'reactive_power' }),
    __metadata("design:type", Number)
], ConverterSnapshot.prototype, "reactivePower", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], ConverterSnapshot.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], ConverterSnapshot.prototype, "thd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], ConverterSnapshot.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ConverterSnapshot.prototype, "createdAt", void 0);
exports.ConverterSnapshot = ConverterSnapshot = __decorate([
    (0, typeorm_1.Entity)('converter_snapshots'),
    (0, typeorm_1.Index)(['converterId', 'timestamp']),
    (0, typeorm_1.Index)(['timestamp'])
], ConverterSnapshot);
//# sourceMappingURL=converter-snapshot.entity.js.map