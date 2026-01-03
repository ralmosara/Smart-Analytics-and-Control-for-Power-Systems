import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BusData } from '@/services/websocket.service';

interface BusState {
  buses: Record<string, BusData>;
  history: Record<string, BusData[]>;
  maxHistorySize: number;
}

const initialState: BusState = {
  buses: {},
  history: {},
  maxHistorySize: 100,
};

const busSlice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    updateBus: (state, action: PayloadAction<BusData>) => {
      const bus = action.payload;
      state.buses[bus.id] = bus;

      // Update history
      if (!state.history[bus.id]) {
        state.history[bus.id] = [];
      }
      state.history[bus.id].push(bus);

      // Keep only the last maxHistorySize entries
      if (state.history[bus.id].length > state.maxHistorySize) {
        state.history[bus.id].shift();
      }
    },
    clearBusHistory: (state, action: PayloadAction<string>) => {
      const busId = action.payload;
      state.history[busId] = [];
    },
    clearAllHistory: (state) => {
      state.history = {};
    },
  },
});

export const { updateBus, clearBusHistory, clearAllHistory } = busSlice.actions;
export default busSlice.reducer;
