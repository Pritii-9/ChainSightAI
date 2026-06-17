import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../constants';
import { useAppStore } from '../store/useAppStore';

export const useRealtime = () => {
  const { addRealtimeAlert, updateShipmentStatus } = useAppStore();

  useEffect(() => {
    // Connect to the Socket.IO backend
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Connected to real-time telemetry stream');
    });

    socket.on('telemetry_update', (data) => {
      console.log('Live Telemetry Event Received:', data);
      
      // Dispatch alert to UI
      addRealtimeAlert(data);

      // Dynamically update shipment status in global state
      if (data.shipment_id && data.status_change) {
        updateShipmentStatus(data.shipment_id, data.status_change);
      }
    });

    socket.on('ais_position', (data) => {
      // Add real-time ship position to the store
      useAppStore.getState().addLiveShip(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from real-time telemetry stream');
    });

    return () => {
      socket.disconnect();
    };
  }, [addRealtimeAlert, updateShipmentStatus]);
};
