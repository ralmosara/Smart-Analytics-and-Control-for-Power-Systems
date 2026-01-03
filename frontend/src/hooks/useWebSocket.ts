import { useEffect, useRef } from 'react';
import { websocketService } from '@/services/websocket.service';

export const useWebSocket = () => {
  const socketRef = useRef(websocketService);

  useEffect(() => {
    const socket = socketRef.current.connect();

    return () => {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    };
  }, []);

  return {
    service: socketRef.current,
    isConnected: socketRef.current.isConnected(),
  };
};