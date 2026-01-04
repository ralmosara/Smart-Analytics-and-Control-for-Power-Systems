export declare class RESSnapshot {
    id: string;
    unitId: string;
    timestamp: Date;
    type: string;
    generation: number;
    capacity: number;
    utilizationFactor: number;
    irradiance: number | null;
    windSpeed: number | null;
    temperature: number;
    createdAt: Date;
}
