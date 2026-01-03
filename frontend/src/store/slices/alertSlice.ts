import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Alert {
  id: string;
  type: 'fault' | 'anomaly';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  timestamp: string;
  details: any;
  acknowledged?: boolean;
}

interface AlertState {
  alerts: Alert[];
  maxAlerts: number;
}

const initialState: AlertState = {
  alerts: [],
  maxAlerts: 50,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);

      // Keep only the last maxAlerts entries
      if (state.alerts.length > state.maxAlerts) {
        state.alerts.pop();
      }
    },
    acknowledgeAlert: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert) {
        alert.acknowledged = true;
      }
    },
    clearAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload);
    },
    clearAllAlerts: (state) => {
      state.alerts = [];
    },
  },
});

export const { addAlert, acknowledgeAlert, clearAlert, clearAllAlerts } = alertSlice.actions;
export default alertSlice.reducer;
