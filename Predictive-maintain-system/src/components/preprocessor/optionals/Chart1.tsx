import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Box, Card, CardContent, Typography, Switch, Grid } from "@mui/material";
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

  // Maintain rolling data buffer
  useEffect(() => {
    if (processedData) {
      setpDataBuffer((prev) => [...prev.slice(-9), processedData.processed_data]);
    }
  }, [processedData]);

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Sensor Dashboard
      </Typography>

      {/* Sensor Status Cards */}
      <Grid container spacing={2} sx={{ marginBottom: "2rem" }}>
        {["vibration", "temperature", "rpm"].map((sensor) => (
          <Grid item xs={12} sm={4} key={sensor}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {sensor.toUpperCase()} Status
                </Typography>
                <Typography variant="body1">
                  Anomaly: {rawData?.[`${sensor}_anomaly_flag`] || "Loading..."}
                </Typography>
                <Typography variant="body1">
                  Null Flags: {["1", "2", "3"].map((i) => rawData?.[`${sensor}_${i}_null_flag`] || 0).join(", ")}
                </Typography>
                <Typography variant="body1">
                  Overall Health: {rawData?.overall_health_status || "Loading..."}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Toggle Streams */}
      <Box sx={{ marginBottom: "1rem" }}>
        {Object.keys(showStreams).map((key) => (
          <Box key={key} sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ marginRight: "1rem" }}>
              {key}
            </Typography>
            <Switch
              checked={showStreams[key as keyof typeof showStreams]}
              onChange={() =>
                setShowStreams((prev) => ({ ...prev, [key]: !prev[key as keyof typeof showStreams] }))
              }
            />
          </Box>
        ))}
      </Box>

      {/* Real-time Data Graph */}
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



      {/* Real-time Data Graph */}
      <LineChart
        width={900}
        height={400}
        data={pdataBuffer}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        {showpStreams.vibration_1 && <Line type="monotone" dataKey="vibration_1" stroke="#8884d8" />}
        {showpStreams.vibration_2 && <Line type="monotone" dataKey="vibration_2" stroke="#82ca9d" />}
        {showpStreams.vibration_3 && <Line type="monotone" dataKey="vibration_3" stroke="#ff7300" />}
        {showpStreams.temperature && <Line type="monotone" dataKey="temperature" stroke="#ff0000" />}
        {showpStreams.rpm && <Line type="monotone" dataKey="rpm" stroke="#0000ff" />}
      </LineChart>
    </Box >
  );
};

export default Dashboard;