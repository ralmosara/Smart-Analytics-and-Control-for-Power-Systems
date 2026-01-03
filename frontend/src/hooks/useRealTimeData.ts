import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { websocketService } from '@/services/websocket.service';
import type { ConverterData, BusData, RESData, FaultAlert, AnomalyAlert } from '@/services/websocket.service';
import { updateConverter } from '@/store/slices/converterSlice';
import { updateBus } from '@/store/slices/busSlice';
import { updateRES } from '@/store/slices/resSlice';
import { addAlert } from '@/store/slices/alertSlice';

export const useRealTimeData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = websocketService.connect();

    // Subscribe to all converters
    const converterIds = ['CONV-001', 'CONV-002', 'CONV-003'];
    websocketService.subscribeToConverters(converterIds, (data: ConverterData) => {
      dispatch(updateConverter(data));
    });

    // Subscribe to all buses
    const busIds = ['BUS-001', 'BUS-002', 'BUS-003', 'BUS-004', 'BUS-005'];
    websocketService.subscribeToBuses(busIds, (data: BusData) => {
      dispatch(updateBus(data));
    });

    // Subscribe to all RES units
    const resIds = ['SOLAR-001', 'SOLAR-002', 'WIND-001', 'WIND-002'];
    websocketService.subscribeToRES(resIds, (data: RESData) => {
      dispatch(updateRES(data));
    });

    // Subscribe to fault alerts
    websocketService.onFaultAlert((data: FaultAlert) => {
      dispatch(addAlert({
        id: data.id,
        type: 'fault',
        severity: data.severity,
        message: data.message,
        timestamp: data.timestamp,
        details: data,
      }));
    });

    // Subscribe to anomaly alerts
    websocketService.onAnomalyAlert((data: AnomalyAlert) => {
      dispatch(addAlert({
        id: data.id,
        type: 'anomaly',
        severity: 'MEDIUM',
        message: data.description,
        timestamp: data.timestamp,
        details: data,
      }));
    });

    return () => {
      websocketService.unsubscribeFromConverters(converterIds);
      websocketService.unsubscribeFromBuses(busIds);
      websocketService.unsubscribeFromRES(resIds);
      websocketService.removeAllListeners();
    };
  }, [dispatch]);
};