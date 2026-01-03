import { ConfigService } from '@nestjs/config';
export declare const getRedisConfig: (configService: ConfigService) => {
    host: string;
    port: number;
    password: string | undefined;
    retryStrategy: (times: number) => number;
    maxRetriesPerRequest: number;
};
export declare const getBullConfig: (configService: ConfigService) => {
    redis: {
        host: string;
        port: number;
        password: string | undefined;
    };
    defaultJobOptions: {
        attempts: number;
        backoff: {
            type: string;
            delay: number;
        };
        removeOnComplete: boolean;
        removeOnFail: boolean;
    };
};
