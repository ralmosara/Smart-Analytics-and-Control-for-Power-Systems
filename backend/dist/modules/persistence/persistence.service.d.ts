import { OnModuleDestroy } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConverterSnapshot } from '../../entities/converter-snapshot.entity';
import { BusSnapshot } from '../../entities/bus-snapshot.entity';
import { RESSnapshot } from '../../entities/res-snapshot.entity';
import type { ConverterData } from '../data-ingestion/simulators/converter-simulator';
import type { BusData } from '../data-ingestion/simulators/grid-simulator';
import type { RESData } from '../data-ingestion/simulators/res-simulator';
export declare class PersistenceService implements OnModuleDestroy {
    private converterRepo;
    private busRepo;
    private resRepo;
    private readonly logger;
    private converterBuffer;
    private busBuffer;
    private resBuffer;
    private readonly BATCH_SIZE;
    private readonly FLUSH_INTERVAL_MS;
    private flushIntervalId;
    constructor(converterRepo: Repository<ConverterSnapshot>, busRepo: Repository<BusSnapshot>, resRepo: Repository<RESSnapshot>);
    onModuleDestroy(): void;
    queueConverterData(data: ConverterData): Promise<void>;
    queueBusData(data: BusData): Promise<void>;
    queueRESData(data: RESData): Promise<void>;
    private flushConverterBuffer;
    private flushBusBuffer;
    private flushRESBuffer;
    private flushAllBuffers;
    private startBatchProcessor;
    private stopBatchProcessor;
    private getConverterType;
    getStats(): {
        converterBuffer: number;
        busBuffer: number;
        resBuffer: number;
        batchSize: number;
        flushInterval: number;
    };
}
