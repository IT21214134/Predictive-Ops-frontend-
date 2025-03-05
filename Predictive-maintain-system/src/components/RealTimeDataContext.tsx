import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type RealTimeData = {
  vibration_1: number;
  vibration_2: number;
  vibration_3: number;
  temperature: number;
  rpm_1: number;
} | null;

type RealTimeDataContextType = {
  data: RealTimeData;
};

const RealTimeDataContext = createContext<RealTimeDataContextType | undefined>(
  undefined
);

export const RealTimeDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [realTimeData, setRealTimeData] = useState<RealTimeData>(null);

  useEffect(() => {
    const socket: Socket = io("http://localhost:8000");

    socket.on("predict_data", (data) => {
      setRealTimeData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <RealTimeDataContext.Provider value={{ data: realTimeData }}>
      {children}
    </RealTimeDataContext.Provider>
  );
};

export const useRealTimeData = () => {
  const context = useContext<RealTimeDataContextType | undefined>(
    RealTimeDataContext
  );
  if (!context) {
    throw new Error(
      "useRealTimeData must be used within a RealTimeDataProvider"
    );
  }
  return context;
};
