"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebSocketConfig = void 0;
const getWebSocketConfig = (configService) => ({
    cors: {
        origin: configService.get('WS_CORS_ORIGIN', 'http://localhost:5173'),
        credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
});
exports.getWebSocketConfig = getWebSocketConfig;
//# sourceMappingURL=websocket.config.js.map