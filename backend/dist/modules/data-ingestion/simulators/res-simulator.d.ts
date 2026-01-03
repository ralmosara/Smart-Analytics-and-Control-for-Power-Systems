export interface RESData {
    unitId: string;
    type: 'SOLAR' | 'WIND';
    generation: number;
    capacity: number;
    utilizationFactor: number;
    environmentalData: {
        irradiance?: number;
        windSpeed?: number;
        temperature: number;
    };
}
export declare class RESSimulator {
    private logger;
    private isRunning;
    private intervalId;
    private callbacks;
    private units;
    start(intervalMs?: number): void;
    stop(): void;
    onData(callback: (data: RESData[]) => void): void;
    private generateData;
    private generateSolarData;
    private generateWindData;
    getStatus(): {
        isRunning: boolean;
        unitCount: number;
        solarUnits: number;
        windUnits: number;
        subscribers: number;
    };
}
