"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBullConfig = exports.getRedisConfig = void 0;
const getRedisConfig = (configService) => ({
    host: configService.get('REDIS_HOST', 'localhost'),
    port: configService.get('REDIS_PORT', 6379),
    password: configService.get('REDIS_PASSWORD'),
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
});
exports.getRedisConfig = getRedisConfig;
const getBullConfig = (configService) => ({
    redis: {
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        password: configService.get('REDIS_PASSWORD'),
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
exports.getBullConfig = getBullConfig;
//# sourceMappingURL=redis.config.js.map