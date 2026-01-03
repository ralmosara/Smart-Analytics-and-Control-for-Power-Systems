import { io, Socket } from 'socket.io-client';

export interface ConverterData {
  id: string;
  type: 'TWO_LEVEL' | 'NPC' | 'BUCK';
  i_d: number;
  i_q: number;
  v_dc: number;
  power_active: number;
  power_reactive: number;
  thd: number;
  temperature: number;
  timestamp: string;
}

export interface BusData {
  id: string;
  voltage_magnitude: number;
  voltage_angle: number;
  frequency: number;
  power_active: number;
  power_reactive: number;
  timestamp: string;
}

export interface RESData {
  id: string;
  type: 'SOLAR' | 'WIND';
  power_output: number;
  efficiency?: number;
  irradiance?: number;
  wind_speed?: number;
  temperature?: number;
  timestamp: string;
}

export interface FaultAlert {
  id: string;
  type: 'OVERCURRENT' | 'OVERVOLTAGE' | 'UNDERVOLTAGE' | 'FREQUENCY_DEVIATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  message: string;
  timestamp: string;
}

export interface AnomalyAlert {
  id: string;
  type: string;
  confidence: number;
  description: string;
  affected_equipment: string[];
  timestamp: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private readonly SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(`${this.SOCKET_URL}/realtime`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToConverters(converterIds: string[], callback: (data: ConverterData) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected. Call connect() first.');
    }

    this.socket.emit('subscribe:converters', converterIds);
    this.socket.on('converter:update', callback);
  }

  unsubscribeFromConverters(converterIds: string[]): void {
    if (!this.socket) return;

    this.socket.emit('unsubscribe:converters', converterIds);
    this.socket.off('converter:update');
  }

  subscribeToBuses(busIds: string[], callback: (data: BusData) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected. Call connect() first.');
    }

    this.socket.emit('subscribe:buses', busIds);
    this.socket.on('bus:update', callback);
  }

  unsubscribeFromBuses(busIds: string[]): void {
    if (!this.socket) return;

    this.socket.emit('unsubscribe:buses', busIds);
    this.socket.off('bus:update');
  }

  subscribeToRES(resIds: string[], callback: (data: RESData) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected. Call connect() first.');
    }

    this.socket.emit('subscribe:res', resIds);
    this.socket.on('res:update', callback);
  }

  unsubscribeFromRES(resIds: string[]): void {
    if (!this.socket) return;

    this.socket.emit('unsubscribe:res', resIds);
    this.socket.off('res:update');
  }

  onFaultAlert(callback: (data: FaultAlert) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected. Call connect() first.');
    }

    this.socket.on('fault:alert', callback);
  }

  onAnomalyAlert(callback: (data: AnomalyAlert) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected. Call connect() first.');
    }

    this.socket.on('anomaly:alert', callback);
  }

  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const websocketService = new WebSocketService();