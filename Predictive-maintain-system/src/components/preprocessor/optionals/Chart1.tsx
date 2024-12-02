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
//       {/* <Grid container spacing={2} sx={{ marginBottom: "2rem" }}>
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
//       </Grid> */}

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

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import useSocket from "@/(hooks)/useSocket";

type SensorData = {
  timestamp: string;
  vibration_1: number;
  vibration_2: number;
  vibration_3: number;
  temperature: number;
  rpm: number;
  vibration_1_null_flag: number;
  vibration_2_null_flag: number;
  vibration_3_null_flag: number;
  temperature_null_flag: number;
  rpm_1_null_flag: number;
  vibration_anomaly_flag: string;
  temperature_anomaly_flag: string;
  rpm_anomaly_flag: string;
  overall_health_status: string;
};

const Dashboard = () => {
  const { rawData, processedData } = useSocket("http://localhost:8000");
  const [dataBuffer, setDataBuffer] = useState<SensorData[]>([]);
  const [showStreams, setShowStreams] = useState({
    vibration_1: true,
    vibration_2: true,
    vibration_3: true,
    temperature: true,
    rpm: true,
  });

  const [pdataBuffer, setpDataBuffer] = useState<SensorData[]>([]);
  const [showpStreams, setShowpStreams] = useState({
    vibration_1: true,
    vibration_2: true,
    vibration_3: true,
    temperature: true,
    rpm: true,
  });

  // Maintain rolling data buffer
  useEffect(() => {
    if (rawData) {
      setDataBuffer((prev) => [...prev.slice(-9), rawData]);
    }
  }, [rawData]);

  useEffect(() => {
    if (processedData) {
      setpDataBuffer((prev) => [...prev.slice(-9), processedData.processed_data]);
    }
  }, [processedData]);

  return (
    <div className="p-6 bg-white-100"> {/*min-h-screen*/}
      {/* <h1 className="text-2xl font-bold mb-6 text-gray-800">Sensor Dashboard</h1> */}

      {/* Toggle Streams */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 text-center">Toggle Streams</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.keys(showStreams).map((key) => (
            <div
              key={key}
              className="flex items-center justify-between p-2 border rounded-md bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="text-sm text-gray-600">{key.replace(/_/g, " ")}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showStreams[key as keyof typeof showStreams]}
                  onChange={() =>
                    setShowStreams((prev) => ({
                      ...prev,
                      [key]: !prev[key as keyof typeof showStreams],
                    }))
                  }
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 peer-focus:ring-2 peer-focus:ring-blue-300 transition-all"></div>
                <div
                  className="absolute w-4 h-4 bg-white border border-gray-300 rounded-full top-0.5 left-1 peer-checked:left-5 peer-checked:border-blue-500 transition-all"
                ></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Data Graph */}
      <center>
        <LineChart
          width={900}
          height={400}
          data={dataBuffer}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          {showStreams.vibration_1 && <Line type="monotone" dataKey="vibration_1" stroke="#8884d8" />}
          {showStreams.vibration_2 && <Line type="monotone" dataKey="vibration_2" stroke="#82ca9d" />}
          {showStreams.vibration_3 && <Line type="monotone" dataKey="vibration_3" stroke="#ff7300" />}
          {showStreams.temperature && <Line type="monotone" dataKey="temperature" stroke="#ff0000" />}
          {showStreams.rpm && <Line type="monotone" dataKey="rpm" stroke="#0000ff" />}
        </LineChart>
        </center>
    </div>
  );
};

export default Dashboard;
