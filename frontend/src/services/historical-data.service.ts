import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export type HistoricalQueryParams = {
  startTime: string; // ISO 8601 format
  endTime: string;   // ISO 8601 format
  aggregation?: 'raw' | '1min' | '5min' | '1hour';
  limit?: number;
};

export type ConverterSnapshot = {
  id: string;
  converterId: string;
  timestamp: string;
  type: string;
  voltage: string;
  currentD: string;
  currentQ: string;
  activePower: string;
  reactivePower: string;
  frequency: string;
  thd: string;
  temperature: string;
  createdAt: string;
};

export type BusSnapshot = {
  id: string;
  busId: string;
  timestamp: string;
  voltageMagnitude: string;
  voltageAngle: string;
  frequency: string;
  activePower: string;
  reactivePower: string;
  createdAt: string;
};

export type RESSnapshot = {
  id: string;
  unitId: string;
  timestamp: string;
  type: string;
  generation: string;
  capacity: string;
  utilizationFactor: string;
  irradiance: string | null;
  windSpeed: string | null;
  temperature: string;
  createdAt: string;
};

export type AggregatedData = {
  bucket: string;
  [key: string]: string | number;
};

export class HistoricalDataService {
  /**
   * Get all available converter IDs
   */
  async getConverterIds(): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/historical/converters`);
    return response.data;
  }

  /**
   * Get historical data for a specific converter
   */
  async getConverterHistory(
    converterId: string,
    params: HistoricalQueryParams,
  ): Promise<ConverterSnapshot[] | AggregatedData[]> {
    const response = await axios.get(
      `${API_BASE_URL}/historical/converters/${converterId}`,
      { params },
    );
    return response.data;
  }

  /**
   * Get all available bus IDs
   */
  async getBusIds(): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/historical/buses`);
    return response.data;
  }

  /**
   * Get historical data for a specific bus
   */
  async getBusHistory(
    busId: string,
    params: HistoricalQueryParams,
  ): Promise<BusSnapshot[] | AggregatedData[]> {
    const response = await axios.get(
      `${API_BASE_URL}/historical/buses/${busId}`,
      { params },
    );
    return response.data;
  }

  /**
   * Get all available RES unit IDs
   */
  async getRESIds(): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/historical/res`);
    return response.data;
  }

  /**
   * Get historical data for a specific RES unit
   */
  async getRESHistory(
    unitId: string,
    params: HistoricalQueryParams,
  ): Promise<RESSnapshot[] | AggregatedData[]> {
    const response = await axios.get(
      `${API_BASE_URL}/historical/res/${unitId}`,
      { params },
    );
    return response.data;
  }
}

// Export singleton instance
export const historicalDataService = new HistoricalDataService();
