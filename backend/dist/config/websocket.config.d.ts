import { ConfigService } from '@nestjs/config';
export declare const getWebSocketConfig: (configService: ConfigService) => {
    cors: {
        origin: string;
        credentials: boolean;
    };
    transports: string[];
    pingTimeout: number;
    pingInterval: number;
};
