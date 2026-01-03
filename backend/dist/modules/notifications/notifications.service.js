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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const notifications_gateway_1 = require("./notifications.gateway");
let NotificationsService = class NotificationsService {
    notificationsGateway;
    logger = new common_1.Logger('NotificationsService');
    constructor(notificationsGateway) {
        this.notificationsGateway = notificationsGateway;
    }
    sendNotification(notification) {
        this.logger.log(`Sending notification: ${notification.title}`);
        this.notificationsGateway.emitNotification(notification);
    }
    sendConverterUpdate(converterId, state) {
        this.notificationsGateway.emitConverterState(converterId, state);
    }
    sendBusUpdate(busId, measurement) {
        this.notificationsGateway.emitBusMeasurement(busId, measurement);
    }
    sendRESUpdate(unitId, generation) {
        this.notificationsGateway.emitRESGeneration(unitId, generation);
    }
    sendFaultAlert(faultEvent) {
        this.notificationsGateway.emitFaultDetected(faultEvent);
        this.sendNotification({
            type: 'error',
            title: 'Fault Detected',
            message: `Fault detected at ${faultEvent.location}`,
            data: faultEvent,
        });
    }
    sendAnomalyAlert(anomalyEvent) {
        this.notificationsGateway.emitAnomalyDetected(anomalyEvent);
        this.sendNotification({
            type: 'warning',
            title: 'Anomaly Detected',
            message: `Anomaly detected in ${anomalyEvent.source}`,
            data: anomalyEvent,
        });
    }
    sendTopologyUpdate(topology) {
        this.notificationsGateway.emitNetworkTopologyUpdate(topology);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_gateway_1.NotificationsGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map