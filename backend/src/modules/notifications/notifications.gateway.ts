import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/realtime',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('NotificationsGateway');
  private activeSubscriptions = new Map<string, Set<string>>();

  constructor(private configService: ConfigService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.activeSubscriptions.set(client.id, new Set());
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.activeSubscriptions.delete(client.id);
  }

  // Subscribe to converter updates
  @SubscribeMessage('subscribe:converters')
  handleSubscribeConverters(
    @MessageBody() converterIds: string[],
    @ConnectedSocket() client: Socket,
  ) {
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

  // Subscribe to bus measurements
  @SubscribeMessage('subscribe:buses')
  handleSubscribeBuses(
    @MessageBody() busIds: string[],
    @ConnectedSocket() client: Socket,
  ) {
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

  // Subscribe to RES units
  @SubscribeMessage('subscribe:res-units')
  handleSubscribeRESUnits(
    @MessageBody() unitIds: string[],
    @ConnectedSocket() client: Socket,
  ) {
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

  // Unsubscribe from converters
  @SubscribeMessage('unsubscribe:converters')
  handleUnsubscribeConverters(
    @MessageBody() converterIds: string[],
    @ConnectedSocket() client: Socket,
  ) {
    const subscriptions = this.activeSubscriptions.get(client.id);
    if (subscriptions) {
      converterIds.forEach((id) => {
        subscriptions.delete(`converter:${id}`);
        client.leave(`converter:${id}`);
      });
    }
    return { unsubscribed: converterIds };
  }

  // Emit converter state update
  emitConverterState(converterId: string, state: any) {
    this.server.to(`converter:${converterId}`).emit('converter:state', {
      converterId,
      state,
      timestamp: new Date(),
    });
  }

  // Emit bus measurement
  emitBusMeasurement(busId: string, measurement: any) {
    this.server.to(`bus:${busId}`).emit('bus:measurement', {
      busId,
      measurement,
      timestamp: new Date(),
    });
  }

  // Emit RES generation data
  emitRESGeneration(unitId: string, generation: number) {
    this.server.to(`res-unit:${unitId}`).emit('res:generation', {
      unitId,
      generation,
      timestamp: new Date(),
    });
  }

  // Emit fault detected event
  emitFaultDetected(faultEvent: any) {
    this.server.emit('fault:detected', {
      ...faultEvent,
      timestamp: new Date(),
    });
  }

  // Emit anomaly detected event
  emitAnomalyDetected(anomalyEvent: any) {
    this.server.emit('anomaly:detected', {
      ...anomalyEvent,
      timestamp: new Date(),
    });
  }

  // Emit general notification
  emitNotification(notification: any) {
    this.server.emit('notification', {
      ...notification,
      timestamp: new Date(),
    });
  }

  // Emit network topology update
  emitNetworkTopologyUpdate(topology: any) {
    this.server.emit('network:topology:update', {
      topology,
      timestamp: new Date(),
    });
  }
}
