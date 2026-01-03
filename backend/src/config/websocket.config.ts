import { ConfigService } from '@nestjs/config';

export const getWebSocketConfig = (configService: ConfigService) => ({
  cors: {
    origin: configService.get<string>('WS_CORS_ORIGIN', 'http://localhost:5173'),
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});
