import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RESData } from '@/services/websocket.service';

interface RESState {
  units: Record<string, RESData>;
  history: Record<string, RESData[]>;
  maxHistorySize: number;
}

const initialState: RESState = {
  units: {},
  history: {},
  maxHistorySize: 100,
};

const resSlice = createSlice({
  name: 'res',
  initialState,
  reducers: {
    updateRES: (state, action: PayloadAction<RESData>) => {
      const unit = action.payload;
      state.units[unit.id] = unit;

      // Update history
      if (!state.history[unit.id]) {
        state.history[unit.id] = [];
      }
      state.history[unit.id].push(unit);

      // Keep only the last maxHistorySize entries
      if (state.history[unit.id].length > state.maxHistorySize) {
        state.history[unit.id].shift();
      }
    },
    clearRESHistory: (state, action: PayloadAction<string>) => {
      const unitId = action.payload;
      state.history[unitId] = [];
    },
    clearAllHistory: (state) => {
      state.history = {};
    },
  },
});

export const { updateRES, clearRESHistory, clearAllHistory } = resSlice.actions;
export default resSlice.reducer;
