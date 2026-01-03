export interface BusData {
    busId: string;
    voltageMagnitude: number;
    voltageAngle: number;
    frequency: number;
    activePower: number;
    reactivePower: number;
}
export declare class GridSimulator {
    private logger;
    private isRunning;
    private intervalId;
    private callbacks;
    private buses;
    start(intervalMs?: number): void;
    stop(): void;
    onData(callback: (data: BusData[]) => void): void;
    private generateData;
    getStatus(): {
        isRunning: boolean;
        busCount: number;
        subscribers: number;
    };
}
