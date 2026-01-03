import { GridSimulator } from './simulators/grid-simulator';
import { ConverterSimulator } from './simulators/converter-simulator';
import { RESSimulator } from './simulators/res-simulator';
import { NotificationsService } from '../notifications/notifications.service';
import { PersistenceService } from '../persistence/persistence.service';
export declare class DataIngestionService {
    private gridSimulator;
    private converterSimulator;
    private resSimulator;
    private notificationsService;
    private persistenceService;
    private logger;
    constructor(gridSimulator: GridSimulator, converterSimulator: ConverterSimulator, resSimulator: RESSimulator, notificationsService: NotificationsService, persistenceService: PersistenceService);
    private setupSimulators;
    startSimulation(): {
        success: boolean;
        message: string;
        status: {
            grid: {
                isRunning: boolean;
                busCount: number;
                subscribers: number;
            };
            converters: {
                isRunning: boolean;
                converterCount: number;
                subscribers: number;
            };
            res: {
                isRunning: boolean;
                unitCount: number;
                solarUnits: number;
                windUnits: number;
                subscribers: number;
            };
        };
    };
    stopSimulation(): {
        success: boolean;
        message: string;
    };
    getSimulationStatus(): {
        grid: {
            isRunning: boolean;
            busCount: number;
            subscribers: number;
        };
        converters: {
            isRunning: boolean;
            converterCount: number;
            subscribers: number;
        };
        res: {
            isRunning: boolean;
            unitCount: number;
            solarUnits: number;
            windUnits: number;
            subscribers: number;
        };
    };
    processCSVUpload(file: Express.Multer.File): Promise<void>;
    ingestSCADAData(data: any): Promise<void>;
}
