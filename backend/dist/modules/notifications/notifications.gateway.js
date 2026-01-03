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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let NotificationsGateway = class NotificationsGateway {
    configService;
    server;
    logger = new common_1.Logger('NotificationsGateway');
    activeSubscriptions = new Map();
    constructor(configService) {
        this.configService = configService;
    }
    afterInit(server) {
        this.logger.log('WebSocket Gateway initialized');
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        this.activeSubscriptions.set(client.id, new Set());
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.activeSubscriptions.delete(client.id);
    }
    handleSubscribeConverters(converterIds, client) {
        const subscriptions = this.activeSubscriptions.get(client.id);
        if (subscriptions) {
            converterIds.forEach((id) => {
                subscriptions.add(`converter:${id}`);
                client.join(`converter:${id}`);
            });
        }
        this.logger.log(`Client ${client.id} subscribed to converters: ${converterIds.join(', ')}`);
        return { subscribed: converterIds };
    }
    handleSubscribeBuses(busIds, client) {
        const subscriptions = this.activeSubscriptions.get(client.id);
        if (subscriptions) {
            busIds.forEach((id) => {
                subscriptions.add(`bus:${id}`);
                client.join(`bus:${id}`);
            });
        }
        this.logger.log(`Client ${client.id} subscribed to buses: ${busIds.join(', ')}`);
        return { subscribed: busIds };
    }
    handleSubscribeRESUnits(unitIds, client) {
        const subscriptions = this.activeSubscriptions.get(client.id);
        if (subscriptions) {
            unitIds.forEach((id) => {
                subscriptions.add(`res-unit:${id}`);
                client.join(`res-unit:${id}`);
            });
        }
        this.logger.log(`Client ${client.id} subscribed to RES units: ${unitIds.join(', ')}`);
        return { subscribed: unitIds };
    }
    handleUnsubscribeConverters(converterIds, client) {
        const subscriptions = this.activeSubscriptions.get(client.id);
        if (subscriptions) {
            converterIds.forEach((id) => {
                subscriptions.delete(`converter:${id}`);
                client.leave(`converter:${id}`);
            });
        }
        return { unsubscribed: converterIds };
    }
    emitConverterState(converterId, state) {
        this.server.to(`converter:${converterId}`).emit('converter:state', {
            converterId,
            state,
            timestamp: new Date(),
        });
    }
    emitBusMeasurement(busId, measurement) {
        this.server.to(`bus:${busId}`).emit('bus:measurement', {
            busId,
            measurement,
            timestamp: new Date(),
        });
    }
    emitRESGeneration(unitId, generation) {
        this.server.to(`res-unit:${unitId}`).emit('res:generation', {
            unitId,
            generation,
            timestamp: new Date(),
        });
    }
    emitFaultDetected(faultEvent) {
        this.server.emit('fault:detected', {
            ...faultEvent,
            timestamp: new Date(),
        });
    }
    emitAnomalyDetected(anomalyEvent) {
        this.server.emit('anomaly:detected', {
            ...anomalyEvent,
            timestamp: new Date(),
        });
    }
    emitNotification(notification) {
        this.server.emit('notification', {
            ...notification,
            timestamp: new Date(),
        });
    }
    emitNetworkTopologyUpdate(topology) {
        this.server.emit('network:topology:update', {
            topology,
            timestamp: new Date(),
        });
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe:converters'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleSubscribeConverters", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe:buses'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleSubscribeBuses", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe:res-units'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleSubscribeRESUnits", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe:converters'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleUnsubscribeConverters", null);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: '/realtime',
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map