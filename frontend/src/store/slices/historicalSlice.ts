import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { historicalDataService } from '../../services/historical-data.service';
import type {
  HistoricalQueryParams,
  ConverterSnapshot,
  BusSnapshot,
  RESSnapshot,
  AggregatedData,
} from '../../services/historical-data.service';

// Async thunks for fetching historical data

export const fetchConverterHistory = createAsyncThunk(
  'historical/fetchConverterHistory',
  async ({
    converterId,
    params,
  }: {
    converterId: string;
    params: HistoricalQueryParams;
  }) => {
    const data = await historicalDataService.getConverterHistory(
      converterId,
      params,
    );
    return { converterId, data };
  },
);

export const fetchBusHistory = createAsyncThunk(
  'historical/fetchBusHistory',
  async ({
    busId,
    params,
  }: {
    busId: string;
    params: HistoricalQueryParams;
  }) => {
    const data = await historicalDataService.getBusHistory(busId, params);
    return { busId, data };
  },
);

export const fetchRESHistory = createAsyncThunk(
  'historical/fetchRESHistory',
  async ({
    unitId,
    params,
  }: {
    unitId: string;
    params: HistoricalQueryParams;
  }) => {
    const data = await historicalDataService.getRESHistory(unitId, params);
    return { unitId, data };
  },
);

export const fetchConverterIds = createAsyncThunk(
  'historical/fetchConverterIds',
  async () => {
    return await historicalDataService.getConverterIds();
  },
);

export const fetchBusIds = createAsyncThunk(
  'historical/fetchBusIds',
  async () => {
    return await historicalDataService.getBusIds();
  },
);

export const fetchRESIds = createAsyncThunk(
  'historical/fetchRESIds',
  async () => {
    return await historicalDataService.getRESIds();
  },
);

// State interface
interface HistoricalState {
  converterHistory: {
    [converterId: string]: (ConverterSnapshot | AggregatedData)[];
  };
  busHistory: {
    [busId: string]: (BusSnapshot | AggregatedData)[];
  };
  resHistory: {
    [unitId: string]: (RESSnapshot | AggregatedData)[];
  };
  converterIds: string[];
  busIds: string[];
  resIds: string[];
  loading: {
    converters: boolean;
    buses: boolean;
    res: boolean;
    ids: boolean;
  };
  error: {
    converters: string | null;
    buses: string | null;
    res: string | null;
    ids: string | null;
  };
}

const initialState: HistoricalState = {
  converterHistory: {},
  busHistory: {},
  resHistory: {},
  converterIds: [],
  busIds: [],
  resIds: [],
  loading: {
    converters: false,
    buses: false,
    res: false,
    ids: false,
  },
  error: {
    converters: null,
    buses: null,
    res: null,
    ids: null,
  },
};

// Slice
const historicalSlice = createSlice({
  name: 'historical',
  initialState,
  reducers: {
    clearConverterHistory: (state, action: PayloadAction<string>) => {
      delete state.converterHistory[action.payload];
    },
    clearBusHistory: (state, action: PayloadAction<string>) => {
      delete state.busHistory[action.payload];
    },
    clearRESHistory: (state, action: PayloadAction<string>) => {
      delete state.resHistory[action.payload];
    },
    clearAllHistory: (state) => {
      state.converterHistory = {};
      state.busHistory = {};
      state.resHistory = {};
    },
    clearError: (
      state,
      action: PayloadAction<'converters' | 'buses' | 'res' | 'ids'>,
    ) => {
      state.error[action.payload] = null;
    },
  },
  extraReducers: (builder) => {
    // Converter History
    builder
      .addCase(fetchConverterHistory.pending, (state) => {
        state.loading.converters = true;
        state.error.converters = null;
      })
      .addCase(fetchConverterHistory.fulfilled, (state, action) => {
        state.loading.converters = false;
        state.converterHistory[action.payload.converterId] =
          action.payload.data;
      })
      .addCase(fetchConverterHistory.rejected, (state, action) => {
        state.loading.converters = false;
        state.error.converters =
          action.error.message || 'Failed to fetch converter history';
      });

    // Bus History
    builder
      .addCase(fetchBusHistory.pending, (state) => {
        state.loading.buses = true;
        state.error.buses = null;
      })
      .addCase(fetchBusHistory.fulfilled, (state, action) => {
        state.loading.buses = false;
        state.busHistory[action.payload.busId] = action.payload.data;
      })
      .addCase(fetchBusHistory.rejected, (state, action) => {
        state.loading.buses = false;
        state.error.buses =
          action.error.message || 'Failed to fetch bus history';
      });

    // RES History
    builder
      .addCase(fetchRESHistory.pending, (state) => {
        state.loading.res = true;
        state.error.res = null;
      })
      .addCase(fetchRESHistory.fulfilled, (state, action) => {
        state.loading.res = false;
        state.resHistory[action.payload.unitId] = action.payload.data;
      })
      .addCase(fetchRESHistory.rejected, (state, action) => {
        state.loading.res = false;
        state.error.res = action.error.message || 'Failed to fetch RES history';
      });

    // Converter IDs
    builder
      .addCase(fetchConverterIds.pending, (state) => {
        state.loading.ids = true;
        state.error.ids = null;
      })
      .addCase(fetchConverterIds.fulfilled, (state, action) => {
        state.loading.ids = false;
        state.converterIds = action.payload;
      })
      .addCase(fetchConverterIds.rejected, (state, action) => {
        state.loading.ids = false;
        state.error.ids =
          action.error.message || 'Failed to fetch converter IDs';
      });

    // Bus IDs
    builder
      .addCase(fetchBusIds.pending, (state) => {
        state.loading.ids = true;
        state.error.ids = null;
      })
      .addCase(fetchBusIds.fulfilled, (state, action) => {
        state.loading.ids = false;
        state.busIds = action.payload;
      })
      .addCase(fetchBusIds.rejected, (state, action) => {
        state.loading.ids = false;
        state.error.ids = action.error.message || 'Failed to fetch bus IDs';
      });

    // RES IDs
    builder
      .addCase(fetchRESIds.pending, (state) => {
        state.loading.ids = true;
        state.error.ids = null;
      })
      .addCase(fetchRESIds.fulfilled, (state, action) => {
        state.loading.ids = false;
        state.resIds = action.payload;
      })
      .addCase(fetchRESIds.rejected, (state, action) => {
        state.loading.ids = false;
        state.error.ids = action.error.message || 'Failed to fetch RES IDs';
      });
  },
});

export const {
  clearConverterHistory,
  clearBusHistory,
  clearRESHistory,
  clearAllHistory,
  clearError,
} = historicalSlice.actions;

export default historicalSlice.reducer;
