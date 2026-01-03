import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
export declare class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private configService;
    server: Server;
    private logger;
    private activeSubscriptions;
    constructor(configService: ConfigService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribeConverters(converterIds: string[], client: Socket): {
        subscribed: string[];
    };
    handleSubscribeBuses(busIds: string[], client: Socket): {
        subscribed: string[];
    };
    handleSubscribeRESUnits(unitIds: string[], client: Socket): {
        subscribed: string[];
    };
    handleUnsubscribeConverters(converterIds: string[], client: Socket): {
        unsubscribed: string[];
    };
    emitConverterState(converterId: string, state: any): void;
    emitBusMeasurement(busId: string, measurement: any): void;
    emitRESGeneration(unitId: string, generation: number): void;
    emitFaultDetected(faultEvent: any): void;
    emitAnomalyDetected(anomalyEvent: any): void;
    emitNotification(notification: any): void;
    emitNetworkTopologyUpdate(topology: any): void;
}
