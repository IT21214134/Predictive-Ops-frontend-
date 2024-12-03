import React, { useState } from 'react';
import useSocket from '@/(hooks)/useSocket';
import Graph from '@/components/preprocessor/Graph';
import AnomalyCard from '@/components/preprocessor/AnomalyCard';
import FilterControls from '@/components/preprocessor/FilterControls';

const Dashboard: React.FC = () => {
  const { rawData, processedData } = useSocket("http://localhost:8000");
  const [activeSensors, setActiveSensors] = useState<string[]>([
    "vibration_1",
    "vibration_2",
    "temperature",
  ]);

  console.log(processedData)

  const handleToggleSensor = (sensor: string) => {
    setActiveSensors((prev) =>
      prev.includes(sensor) ? prev.filter((s) => s !== sensor) : [...prev, sensor]
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Live Sensor Dashboard</h1>

      {/* Anomaly Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <AnomalyCard
          title="Vibration Sensor 1"
          status={rawData?.overall_health_status || "Unknown"}
          anomaly={rawData?.vibration_anomaly_flag || "Unknown"}
          isNull={false}
        />
        <AnomalyCard
          title="Temperature Sensor"
          status={rawData?.overall_health_status || "Unknown"}
          anomaly={rawData?.temperature_anomaly_flag || "Unknown"}
          isNull={false}
        />
      </div>

      {/* Filter Controls */}
      <FilterControls
        sensors={["vibration_1", "vibration_2", "temperature"]}
        onToggle={handleToggleSensor}
      />

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeSensors.includes("vibration_1") && (
          <Graph
            label="Vibration 1"
            data={processedData?.processed_data?.vibration_1 || []}
            timestamps={processedData?.timestamps || []}
          />
        )}
        {activeSensors.includes("temperature") && (
          <Graph
            label="Temperature"
            data={processedData?.processed_data?.temperature || []}
            timestamps={processedData?.timestamps || []}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;