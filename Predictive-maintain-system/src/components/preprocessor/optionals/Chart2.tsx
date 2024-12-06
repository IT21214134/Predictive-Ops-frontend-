import React, { useState, useEffect } from 'react';
import useSocket from '@/(hooks)/useSocket';
import Graph from '@/components/preprocessor/Graph';
import AnomalyCard from '@/components/preprocessor/AnomalyCard';
import FilterControls from '@/components/preprocessor/FilterControls';
import { BACKEND_PORT } from '@/config/consts';

interface DataPoint {
  timestamp: string;
  [key: string]: number | string | undefined;
}

const MAX_HISTORY = 100; // Number of data points to retain for graphs.

const Dashboard: React.FC = () => {
  const { rawData, processedData } = useSocket(BACKEND_PORT);
  const [activeSensors, setActiveSensors] = useState<string[]>([
    "vibration_1",
    "vibration_2",
    "vibration_3",
    "temperature",
    "rpm"
  ]);
  const [dataHistory, setDataHistory] = useState<{ [key: string]: DataPoint[] }>({});

  useEffect(() => {
    if (rawData) {
      setDataHistory((prev) => {
        const updatedHistory = { ...prev };
        Object.keys(rawData).forEach((key) => {
          if (!updatedHistory[key]) updatedHistory[key] = [];
          updatedHistory[key] = [
            ...updatedHistory[key],
            { timestamp: new Date(rawData.timestamp).toLocaleString(), value: rawData[key] },
          ].slice(-MAX_HISTORY); // Maintain a fixed-length buffer.
        });
        return updatedHistory;
      });
    }
  }, [rawData]);

  const handleToggleSensor = (sensor: string) => {
    setActiveSensors((prev) =>
      prev.includes(sensor) ? prev.filter((s) => s !== sensor) : [...prev, sensor]
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Individual Sensor Behaviours</h1>

      {/* Anomaly Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <AnomalyCard
          title="Vibration Sensor"
          status={rawData?.overall_health_status || "Unknown"}
          anomaly={rawData?.vibration_anomaly_flag || "Unknown"}
          isNull={rawData?.vibration_1_null_flag}
        />
        <AnomalyCard
          title="Temperature Sensor"
          status={rawData?.overall_health_status || "Unknown"}
          anomaly={rawData?.temperature_anomaly_flag || "Unknown"}
          isNull={rawData?.temperature_null_flag}
        />
        <AnomalyCard
          title="RPM Sensor"
          status={rawData?.overall_health_status || "Unknown"}
          anomaly={rawData?.rpm_anomaly_flag || "Unknown"}
          isNull={rawData?.rpm_1_null_flag}
        />
      </div> */}

      {/* Filter Controls */}
      <FilterControls
        sensors={["vibration_1", "vibration_2", "vibration_3", "temperature", "rpm"]}
        onToggle={handleToggleSensor}
        activeSensors={activeSensors}
      />

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeSensors.map((sensor, index) => (
          <div key={index}>
            <Graph
              key={sensor}
              label={sensor}
              data={dataHistory[sensor]?.map((d) => Number(d.value)).filter((v) => !isNaN(v)) || []}
              timestamps={dataHistory[sensor]?.map((d) => d.timestamp) || []}
            /><br /></div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;