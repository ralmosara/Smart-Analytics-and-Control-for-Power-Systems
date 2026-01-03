export interface ConverterData {
    converterId: string;
    voltage: number;
    current_d: number;
    current_q: number;
    activePower: number;
    reactivePower: number;
    frequency: number;
    thd: number;
    temperature: number;
}
export declare class ConverterSimulator {
    private logger;
    private isRunning;
    private intervalId;
    private callbacks;
    private converters;
    start(intervalMs?: number): void;
    stop(): void;
    onData(callback: (data: ConverterData[]) => void): void;
    private generateData;
    getStatus(): {
        isRunning: boolean;
        converterCount: number;
        subscribers: number;
    };
}
