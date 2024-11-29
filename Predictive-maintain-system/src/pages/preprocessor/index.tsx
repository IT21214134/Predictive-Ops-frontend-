/*import React from 'react';
import useSocket from '@/(hooks)/useSocket';

const RealTimeData: React.FC = () => {
  const { rawData, processedData } = useSocket('ws://localhost:8000');

  return (
    <div>
      <h1>Real-Time Sensor Data</h1>
      <div>
        <h2>Raw Data:</h2>
        <pre>{JSON.stringify(rawData, null, 2)}</pre>
      </div>
      <div>
        <h2>Processed Data:</h2>
        <pre>{JSON.stringify(processedData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default RealTimeData;*/





// -----------------------------


// WORKED 1

// import React, { useState } from 'react';
// import useSocket from '@/(hooks)/useSocket';
// import Graph from '@/components/preprocessor/Graph';
// import AnomalyCard from '@/components/preprocessor/AnomalyCard';
// import FilterControls from '@/components/preprocessor/FilterControls';

// const Dashboard: React.FC = () => {
//   const { rawData, processedData } = useSocket("http://localhost:8000");
//   const [activeSensors, setActiveSensors] = useState<string[]>([
//     "vibration_1",
//     "vibration_2",
//     "temperature",
//   ]);

//   console.log(processedData)

//   const handleToggleSensor = (sensor: string) => {
//     setActiveSensors((prev) =>
//       prev.includes(sensor) ? prev.filter((s) => s !== sensor) : [...prev, sensor]
//     );
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Live Sensor Dashboard</h1>

//       {/* Anomaly Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <AnomalyCard
//           title="Vibration Sensor 1"
//           status={rawData?.overall_health_status || "Unknown"}
//           anomaly={rawData?.vibration_anomaly_flag || "Unknown"}
//         />
//         <AnomalyCard
//           title="Temperature Sensor"
//           status={rawData?.overall_health_status || "Unknown"}
//           anomaly={rawData?.temperature_anomaly_flag || "Unknown"}
//         />
//       </div>

//       {/* Filter Controls */}
//       <FilterControls
//         sensors={["vibration_1", "vibration_2", "temperature"]}
//         onToggle={handleToggleSensor}
//       />

//       {/* Graphs */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {activeSensors.includes("vibration_1") && (
//           <Graph
//             label="Vibration 1"
//             data={processedData?.processed_data?.vibration_1 || []}
//             timestamps={processedData?.timestamps || []}
//           />
//         )}
//         {activeSensors.includes("temperature") && (
//           <Graph
//             label="Temperature"
//             data={processedData?.processed_data?.temperature || []}
//             timestamps={processedData?.timestamps || []}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;






// -------------------------------------------------------




// WORKED 2



// import React, { useState, useEffect } from 'react';
// import useSocket from '@/(hooks)/useSocket';
// import Graph from '@/components/preprocessor/Graph';
// import AnomalyCard from '@/components/preprocessor/AnomalyCard';
// import FilterControls from '@/components/preprocessor/FilterControls';

// interface DataPoint {
//   timestamp: string;
//   [key: string]: number | string | undefined;
// }

// const MAX_HISTORY = 50; // Number of data points to retain for graphs.

// const Dashboard: React.FC = () => {
//   const { rawData, processedData } = useSocket("http://localhost:8000");
//   const [activeSensors, setActiveSensors] = useState<string[]>([
//     "vibration_1",
//     "vibration_2",
//     "vibration_3",
//     "temperature",
//     "rpm"
//   ]);
//   const [dataHistory, setDataHistory] = useState<{ [key: string]: DataPoint[] }>({});

//   useEffect(() => {
//     if (rawData) {
//       setDataHistory((prev) => {
//         const updatedHistory = { ...prev };
//         Object.keys(rawData).forEach((key) => {
//           if (!updatedHistory[key]) updatedHistory[key] = [];
//           updatedHistory[key] = [
//             ...updatedHistory[key],
//             { timestamp: rawData.timestamp, value: rawData[key] },
//           ].slice(-MAX_HISTORY); // Maintain a fixed-length buffer.
//         });
//         return updatedHistory;
//       });
//     }
//   }, [rawData]);

//   const handleToggleSensor = (sensor: string) => {
//     setActiveSensors((prev) =>
//       prev.includes(sensor) ? prev.filter((s) => s !== sensor) : [...prev, sensor]
//     );
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Live Sensor Dashboard</h1>

//       {/* Anomaly Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <AnomalyCard
//           title="Vibration Sensor"
//           status={rawData?.overall_health_status || "Unknown"}
//           anomaly={rawData?.vibration_anomaly_flag || "Unknown"}
//           isNull={rawData?.vibration_1_null_flag}
//         />
//         <AnomalyCard
//           title="Temperature Sensor"
//           status={rawData?.overall_health_status || "Unknown"}
//           anomaly={rawData?.temperature_anomaly_flag || "Unknown"}
//           isNull={rawData?.temperature_null_flag}
//         />
//         <AnomalyCard
//           title="RPM Sensor"
//           status={rawData?.overall_health_status || "Unknown"}
//           anomaly={rawData?.rpm_anomaly_flag || "Unknown"}
//           isNull={rawData?.rpm_1_null_flag}
//         />
//       </div>

//       {/* Filter Controls */}
//       <FilterControls
//         sensors={["vibration_1", "vibration_2", "temperature"]}
//         onToggle={handleToggleSensor}
//       />

//       {/* Graphs */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {activeSensors.map((sensor, index) => (
//           <div key={index}>
//             <Graph
//               key={sensor}
//               label={sensor}
//               data={dataHistory[sensor]?.map((d) => d.value) || []}
//               timestamps={dataHistory[sensor]?.map((d) => d.timestamp) || []}
//             /><br /></div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;








// ------------------------------------------------------




// Worked 03




// import React, { useEffect, useState } from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
// import { Box, Card, CardContent, Typography, Switch, Grid } from "@mui/material";
// import useSocket from "@/(hooks)/useSocket";

// type SensorData = {
//   timestamp: string;
//   vibration_1: number;
//   vibration_2: number;
//   vibration_3: number;
//   temperature: number;
//   rpm: number;
//   vibration_1_null_flag: number;
//   vibration_2_null_flag: number;
//   vibration_3_null_flag: number;
//   temperature_null_flag: number;
//   rpm_1_null_flag: number;
//   vibration_anomaly_flag: string;
//   temperature_anomaly_flag: string;
//   rpm_anomaly_flag: string;
//   overall_health_status: string;
// };

// const Dashboard = () => {
//   const { rawData, processedData } = useSocket("http://localhost:8000");
//   const [dataBuffer, setDataBuffer] = useState<SensorData[]>([]);
//   const [showStreams, setShowStreams] = useState({
//     vibration_1: true,
//     vibration_2: true,
//     vibration_3: true,
//     temperature: true,
//     rpm: true,
//   });

//   const [pdataBuffer, setpDataBuffer] = useState<SensorData[]>([]);
//   const [showpStreams, setShowpStreams] = useState({
//     vibration_1: true,
//     vibration_2: true,
//     vibration_3: true,
//     temperature: true,
//     rpm: true,
//   });

//   // Maintain rolling data buffer
//   useEffect(() => {
//     if (rawData) {
//       setDataBuffer((prev) => [...prev.slice(-9), rawData]);
//     }
//   }, [rawData]);

//   // Maintain rolling data buffer
//   useEffect(() => {
//     if (processedData) {
//       setpDataBuffer((prev) => [...prev.slice(-9), processedData.processed_data]);
//     }
//   }, [processedData]);

//   return (
//     <Box sx={{ padding: "2rem", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
//       <Typography variant="h4" gutterBottom>
//         Sensor Dashboard
//       </Typography>

//       {/* Sensor Status Cards */}
//       <Grid container spacing={2} sx={{ marginBottom: "2rem" }}>
//         {["vibration", "temperature", "rpm"].map((sensor) => (
//           <Grid item xs={12} sm={4} key={sensor}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" color="textSecondary" gutterBottom>
//                   {sensor.toUpperCase()} Status
//                 </Typography>
//                 <Typography variant="body1">
//                   Anomaly: {rawData?.[`${sensor}_anomaly_flag`] || "Loading..."}
//                 </Typography>
//                 <Typography variant="body1">
//                   Null Flags: {["1", "2", "3"].map((i) => rawData?.[`${sensor}_${i}_null_flag`] || 0).join(", ")}
//                 </Typography>
//                 <Typography variant="body1">
//                   Overall Health: {rawData?.overall_health_status || "Loading..."}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Toggle Streams */}
//       <Box sx={{ marginBottom: "1rem" }}>
//         {Object.keys(showStreams).map((key) => (
//           <Box key={key} sx={{ display: "flex", alignItems: "center" }}>
//             <Typography variant="body1" sx={{ marginRight: "1rem" }}>
//               {key}
//             </Typography>
//             <Switch
//               checked={showStreams[key as keyof typeof showStreams]}
//               onChange={() =>
//                 setShowStreams((prev) => ({ ...prev, [key]: !prev[key as keyof typeof showStreams] }))
//               }
//             />
//           </Box>
//         ))}
//       </Box>

//       {/* Real-time Data Graph */}
//       <LineChart
//         width={900}
//         height={400}
//         data={dataBuffer}
//         margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="timestamp" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         {showStreams.vibration_1 && <Line type="monotone" dataKey="vibration_1" stroke="#8884d8" />}
//         {showStreams.vibration_2 && <Line type="monotone" dataKey="vibration_2" stroke="#82ca9d" />}
//         {showStreams.vibration_3 && <Line type="monotone" dataKey="vibration_3" stroke="#ff7300" />}
//         {showStreams.temperature && <Line type="monotone" dataKey="temperature" stroke="#ff0000" />}
//         {showStreams.rpm && <Line type="monotone" dataKey="rpm" stroke="#0000ff" />}
//       </LineChart>



//       {/* Real-time Data Graph */}
//       <LineChart
//         width={900}
//         height={400}
//         data={pdataBuffer}
//         margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="timestamp" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         {showpStreams.vibration_1 && <Line type="monotone" dataKey="vibration_1" stroke="#8884d8" />}
//         {showpStreams.vibration_2 && <Line type="monotone" dataKey="vibration_2" stroke="#82ca9d" />}
//         {showpStreams.vibration_3 && <Line type="monotone" dataKey="vibration_3" stroke="#ff7300" />}
//         {showpStreams.temperature && <Line type="monotone" dataKey="temperature" stroke="#ff0000" />}
//         {showpStreams.rpm && <Line type="monotone" dataKey="rpm" stroke="#0000ff" />}
//       </LineChart>
//     </Box >
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Box, Card, CardContent, Typography, Switch, FormControlLabel, Grid, Badge } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import useSocket from "@/(hooks)/useSocket";
import Chart1 from "@/components/preprocessor/optionals/Chart1";
import Chart2 from "@/components/preprocessor/optionals/Chart2";
import StatisticalGrid from "@/components/preprocessor/StatisticalGrid";
import SensorStatus from "@/components/preprocessor/SensorStatus";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const { rawData, processedData } = useSocket("http://localhost:8000");
  const [graphData, setGraphData] = useState<any[]>([]);
  const [showProcessed, setShowProcessed] = useState(true);
  const maxDataPoints = 50; // Limit number of data points displayed

  useEffect(() => {
    if (rawData && processedData) {
      setGraphData((prev) => {
        const newGraphData = [...prev, { rawData, processedData }];
        return newGraphData.slice(-maxDataPoints);
      });
    }
  }, [rawData, processedData]);

  const toggleProcessed = () => setShowProcessed(!showProcessed);

  const formatGraphData = (type: "raw" | "processed") => {
    const labels = graphData.map((data) => new Date(data.rawData.timestamp).toLocaleTimeString());
    const datasets = [
      {
        label: "Vibration 1",
        data: graphData.map((data) =>
          type === "raw" ? data.rawData.vibration_1 : data.processedData.processed_data.vibration_1
        ),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Vibration 2",
        data: graphData.map((data) =>
          type === "raw" ? data.rawData.vibration_2 : data.processedData.processed_data.vibration_2
        ),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Vibration 3",
        data: graphData.map((data) =>
          type === "raw" ? data.rawData.vibration_3 : data.processedData.processed_data.vibration_3
        ),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Temperature",
        data: graphData.map((data) =>
          type === "raw" ? data.rawData.temperature : data.processedData.processed_data.temperature
        ),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "RPM",
        data: graphData.map((data) =>
          type === "raw" ? data.rawData.rpm : data.processedData.processed_data.rpm
        ),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ];
    return { labels, datasets };
  };

  return (
    <>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Real-Time Sensor Dashboard
        </Typography>
        <Grid container spacing={4}>
          {/* Data Graphs */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Sensor Data</Typography>
                <Line data={formatGraphData(showProcessed ? "processed" : "raw")} />
                <FormControlLabel
                  control={<Switch checked={showProcessed} onChange={toggleProcessed} />}
                  label="Show Processed Data"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Sensor Status Cards */}
          <Grid item xs={12} container spacing={2}>
            {graphData.length > 0 &&
              Object.keys(rawData).filter((key) => key.endsWith("_null_flag")).map((flagKey, index) => {
                const sensorName = flagKey.replace("_null_flag", "").replace("_", " ").toUpperCase();
                const isAnomaly = rawData[`${sensorName.toLowerCase()}_anomaly_flag`] !== "Normal";
                const isNull = rawData[flagKey] === 1;

                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Badge
                      color={isAnomaly ? "error" : isNull ? "warning" : "success"}
                      badgeContent={isAnomaly ? "Anomaly" : isNull ? "Null" : "Healthy"}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{sensorName}</Typography>
                          <Typography variant="body2">Status: {isAnomaly ? "Anomalous" : isNull ? "Null" : "Normal"}</Typography>
                          <Typography variant="body2">Overall Health: {rawData.overall_health_status}</Typography>
                        </CardContent>
                      </Card>
                    </Badge>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
      </Box>
      <Chart1 />
      <Chart2 />

      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-700 mb-4 text-center">Sensor Statistics</h1>
        <StatisticalGrid sensorStats={[
          { ...processedData?.statistics?.vibration_1, sensorName: "Vibration_1" },
          { ...processedData?.statistics?.vibration_2, sensorName: "Vibration_2" },
          { ...processedData?.statistics?.vibration_3, sensorName: "Vibration_3" },
          { ...processedData?.statistics?.temperature, sensorName: "Temperature" },
          { ...processedData?.statistics?.rpm, sensorName: "RPM" }
        ]} />
      </div>



      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Real-Time Sensor Statuses</h1>

        {/* Overall Health Status */}
        {rawData && (
          <div className="mb-6 text-center">
            <span
              className={`px-4 py-2 rounded-full text-white font-bold ${rawData.vibration_1_null_flag == 0 && rawData.vibration_2_null_flag == 0 && rawData.vibration_3_null_flag == 0 && rawData.temperature_null_flag == 0 && rawData.rpm_1_null_flag == 0
                && rawData.overall_health_status === "Healthy"
                ? "bg-green-500"
                : "bg-gradient-to-r from-red-500 to-orange-500 bg-red-500" //bg-red-500
                }`}
            >
              {rawData.vibration_1_null_flag == 0 && rawData.vibration_2_null_flag == 0 && rawData.vibration_3_null_flag == 0 && rawData.temperature_null_flag == 0 && rawData.rpm_1_null_flag == 0
                && rawData.overall_health_status === "Healthy" ? "Healthy" : "Cautious"}
            </span>
          </div>
        )}

        {/* Sensor Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {rawData && (
            <>
              <SensorStatus
                name="Vibration (1)"
                value={rawData?.vibration_1}
                processedValue={processedData?.processed_data?.vibration_1}
                nullFlag={rawData?.vibration_1_null_flag}
                anomalyFlag={rawData?.vibration_anomaly_flag}
              />
              <SensorStatus
                name="Vibration (2)"
                value={rawData?.vibration_2}
                processedValue={processedData?.processed_data?.vibration_2}
                nullFlag={rawData?.vibration_2_null_flag}
                anomalyFlag={rawData?.vibration_anomaly_flag}
              />
              <SensorStatus
                name="Vibration (3)"
                value={rawData?.vibration_3}
                processedValue={processedData?.processed_data?.vibration_3}
                nullFlag={rawData?.vibration_3_null_flag}
                anomalyFlag={rawData?.vibration_anomaly_flag}
              />
              <SensorStatus
                name="Temperature"
                value={rawData.temperature}
                processedValue={processedData?.processed_data?.temperature}
                nullFlag={rawData.temperature_null_flag}
                anomalyFlag={rawData.temperature_anomaly_flag}
              />
              <SensorStatus
                name="RPM"
                value={rawData.rpm}
                processedValue={processedData?.processed_data.rpm}
                nullFlag={rawData.rpm_1_null_flag}
                anomalyFlag={rawData.rpm_anomaly_flag}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

















// import Layout from "@/components/preprocessor/Layout";
// import SensorGraph from "@/components/preprocessor/SensorGraph";
// import DataTable from "@/components/preprocessor/DataTable";
// import ToggleControls from "@/components/preprocessor/ToggleControls";

// const Dashboard = () => {
//   const handleToggle = (sensor: string, enabled: boolean) => {
//     console.log(`${sensor} toggled ${enabled ? "on" : "off"}`);
//   };

//   return (
//     <Layout>
//       <ToggleControls onToggle={handleToggle} />
//       <SensorGraph dataStream="raw-data" />
//       <DataTable />
//     </Layout>
//   );
// };

// export default Dashboard;
