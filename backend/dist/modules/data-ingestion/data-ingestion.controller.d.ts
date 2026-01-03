import { DataIngestionService } from './data-ingestion.service';
export declare class DataIngestionController {
    private readonly dataIngestionService;
    constructor(dataIngestionService: DataIngestionService);
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
}
