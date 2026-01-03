import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ConverterData } from '@/services/websocket.service';

interface ConverterState {
  converters: Record<string, ConverterData>;
  history: Record<string, ConverterData[]>;
  maxHistorySize: number;
}

const initialState: ConverterState = {
  converters: {},
  history: {},
  maxHistorySize: 100, // Keep last 100 data points per converter
};

const converterSlice = createSlice({
  name: 'converter',
  initialState,
  reducers: {
    updateConverter: (state, action: PayloadAction<ConverterData>) => {
      const converter = action.payload;
      state.converters[converter.id] = converter;

      // Update history
      if (!state.history[converter.id]) {
        state.history[converter.id] = [];
      }
      state.history[converter.id].push(converter);

      // Keep only the last maxHistorySize entries
      if (state.history[converter.id].length > state.maxHistorySize) {
        state.history[converter.id].shift();
      }
    },
    clearConverterHistory: (state, action: PayloadAction<string>) => {
      const converterId = action.payload;
      state.history[converterId] = [];
    },
    clearAllHistory: (state) => {
      state.history = {};
    },
  },
});

export const { updateConverter, clearConverterHistory, clearAllHistory } = converterSlice.actions;
export default converterSlice.reducer;