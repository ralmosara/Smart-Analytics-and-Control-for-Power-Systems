import { NotificationsGateway } from './notifications.gateway';
export interface Notification {
    id?: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    data?: any;
}
export declare class NotificationsService {
    private notificationsGateway;
    private logger;
    constructor(notificationsGateway: NotificationsGateway);
    sendNotification(notification: Notification): void;
    sendConverterUpdate(converterId: string, state: any): void;
    sendBusUpdate(busId: string, measurement: any): void;
    sendRESUpdate(unitId: string, generation: number): void;
    sendFaultAlert(faultEvent: any): void;
    sendAnomalyAlert(anomalyEvent: any): void;
    sendTopologyUpdate(topology: any): void;
}
