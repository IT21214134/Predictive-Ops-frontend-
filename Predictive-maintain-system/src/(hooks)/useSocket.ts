import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [rawData, setRawData] = useState<any>(null);
  const [processedData, setProcessedData] = useState<any>(null);

  useEffect(() => {
    const socketInstance = io(url);

    // Event listeners
    socketInstance.on('connect', () => {
      console.log('Connected to server');
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socketInstance.on('raw_data', (data) => {
      console.log('Raw data received:', data);
      setRawData(data);
    });

    socketInstance.on('processed_data', (data) => {
      console.log('Processed data received:', data);
      setProcessedData(data);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  return { socket, rawData, processedData };
};

export default useSocket;
