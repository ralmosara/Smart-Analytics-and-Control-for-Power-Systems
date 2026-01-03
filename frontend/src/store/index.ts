import { configureStore } from '@reduxjs/toolkit';
import converterReducer from './slices/converterSlice';
import busReducer from './slices/busSlice';
import resReducer from './slices/resSlice';
import alertReducer from './slices/alertSlice';

export const store = configureStore({
  reducer: {
    converter: converterReducer,
    bus: busReducer,
    res: resReducer,
    alert: alertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['alert/addAlert'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.details'],
        // Ignore these paths in the state
        ignoredPaths: ['alert.alerts'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
