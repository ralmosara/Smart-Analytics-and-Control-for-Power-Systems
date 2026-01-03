import { Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

export interface Notification {
  id?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  data?: any;
}

@Injectable()
export class NotificationsService {
  private logger = new Logger('NotificationsService');

  constructor(private notificationsGateway: NotificationsGateway) {}

  sendNotification(notification: Notification) {
    this.logger.log(`Sending notification: ${notification.title}`);
    this.notificationsGateway.emitNotification(notification);
  }

  sendConverterUpdate(converterId: string, state: any) {
    this.notificationsGateway.emitConverterState(converterId, state);
  }

  sendBusUpdate(busId: string, measurement: any) {
    this.notificationsGateway.emitBusMeasurement(busId, measurement);
  }

  sendRESUpdate(unitId: string, generation: number) {
    this.notificationsGateway.emitRESGeneration(unitId, generation);
  }

  sendFaultAlert(faultEvent: any) {
    this.notificationsGateway.emitFaultDetected(faultEvent);
    this.sendNotification({
      type: 'error',
      title: 'Fault Detected',
      message: `Fault detected at ${faultEvent.location}`,
      data: faultEvent,
    });
  }

  sendAnomalyAlert(anomalyEvent: any) {
    this.notificationsGateway.emitAnomalyDetected(anomalyEvent);
    this.sendNotification({
      type: 'warning',
      title: 'Anomaly Detected',
      message: `Anomaly detected in ${anomalyEvent.source}`,
      data: anomalyEvent,
    });
  }

  sendTopologyUpdate(topology: any) {
    this.notificationsGateway.emitNetworkTopologyUpdate(topology);
  }
}
