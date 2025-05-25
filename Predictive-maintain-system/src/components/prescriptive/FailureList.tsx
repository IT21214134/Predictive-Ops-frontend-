"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Alert,
  Stack,
} from "@mui/material";
import {
  RestartAlt as ResetIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";

const CHIP_STYLES = {
  minWidth: 160, // Set a fixed minimum width for all chips
  justifyContent: "center",
  "& .MuiChip-label": {
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
} as const;

const TABLE_HEADER_STYLES = {
  fontWeight: 600,
  color: "#1976d2",
  fontSize: "0.875rem",
  backgroundColor: "rgba(25, 118, 210, 0.04)",
  borderBottom: "2px solid rgba(25, 118, 210, 0.1)",
  padding: "12px 16px",
  whiteSpace: "nowrap",
} as const;

export type FailureData = {
  connectionDeviceId: number;
  vibration_01: number;
  vibration_02: number;
  vibration_03: number;
  temperature: number;
  rpm_1: number;
  deviceID: string;
  timestamp: string;
  Target: number;
  Failure_Type_Name: string;
  Failure_Type: number;
};

export default function FailureList() {
  const router = useRouter();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [csvData, setCsvData] = useState<FailureData[]>([]);

  useEffect(() => {
    // Load and parse the CSV file
    const fetchData = async () => {
      try {
        const response = await fetch("/dataset.csv");
        const csvText = await response.text();

        // Parse CSV data using PapaParse
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (result) => {
            const parsedData: FailureData[] = result.data
              .map((row: any) => ({
                connectionDeviceId: row.connectionDeviceId,
                vibration_01: row.Vibration_01,
                vibration_02: row.Vibration_02,
                vibration_03: row.Vibration_03,
                temperature: row.Temperature_01,
                rpm_1: row.RPM_Sensor_01,
                deviceID: row.deviceID,
                timestamp: row.timestamp,
                Target: row.Target,
                Failure_Type: row.Failure_Type,
                Failure_Type_Name: row.Failure_Type_Encoded,
              }))
              .filter(
                (row) =>
                  row.Target !== 0 && row.Failure_Type_Name !== "No Failure"
              );

            setCsvData(parsedData);
          },
        });
      } catch (error) {
        console.error("Error loading CSV file:", error);
      }
    };

    fetchData();
  }, []);

  const handleAnalyze = (failureData: FailureData) => {
    router.push(
      `/prescriptive/analyze?data=${encodeURIComponent(
        JSON.stringify(failureData)
      )}`
    );
    localStorage.setItem("failureData", JSON.stringify(failureData));
  };

  const filteredData = csvData
    .filter((row) => {
      const rowDate = new Date(row.timestamp);
      const start = startDate
        ? new Date(new Date(startDate).toISOString())
        : null;
      const end = endDate ? new Date(new Date(endDate).toISOString()) : null;

      return (!start || rowDate >= start) && (!end || rowDate <= end);
    })
    // Limit the filtered data to 20 records
    .slice(0, 20);

  const getFailureTypeStyle = (failureType: string) => {
    switch (failureType) {
      case "Trimmer Bearing Fault":
        return {
          color: "#f57c00", // Darker orange for better contrast
          backgroundColor: "rgba(255, 243, 224, 0.4)",
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)", // Subtle dark glow
        };
      case "Drill Issue":
        return {
          color: "#d32f2f", // Darker red for better contrast
          backgroundColor: "rgba(255, 235, 238, 0.4)",
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)", // Subtle dark glow
        };
      default:
        return {
          color: "#424242", // Darker grey for better contrast
          backgroundColor: "rgba(245, 245, 245, 0.4)",
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)", // Subtle dark glow
        };
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
        Predicted Failure List
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Box flex={1}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Start Date & Time (UTC)"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              label="End Date & Time (UTC)"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ flex: 1 }}
            />
          </Stack>
        </Box>
        <Tooltip title="Reset Filters">
          <IconButton
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            color="primary"
          >
            <ResetIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: "0.5rem",
          border: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "grey.100",
                px: 4,
                py: 2,
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "grey.700",
                borderBottom: "1px solid",
                borderColor: "grey.300",
                whiteSpace: "nowrap",
              }}
            >
              {[
                {
                  id: "timestamp",
                  label: "Timestamp",
                },
                {
                  id: "vibration1",
                  label: "Vibration 1",
                },
                {
                  id: "vibration2",
                  label: "Vibration 2",
                },
                {
                  id: "vibration3",
                  label: "Vibration 3",
                },
                {
                  id: "temperature",
                  label: "Temperature",
                },
                {
                  id: "rpm",
                  label: "RPM",
                },
                {
                  id: "failureType",
                  label: "Failure Type",
                },
                {
                  id: "actions",
                  label: "Actions",
                  align: "center",
                },
              ].map((column) => (
                <TableCell
                  key={column.id}
                  align={
                    (column.align as
                      | "inherit"
                      | "left"
                      | "center"
                      | "right"
                      | "justify") || "left"
                  }
                  sx={{
                    ...TABLE_HEADER_STYLES,
                    "&:hover": {
                      bgcolor: "grey.50",
                    },
                    transition: "background-color 0.2s ease",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: "rgba(25, 118, 210, 0.1)",
                      transform: "scaleX(0)",
                      transition: "transform 0.2s ease",
                    },
                    "&:hover::after": {
                      transform: "scaleX(1)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {column.label}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow
                key={row.connectionDeviceId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  {new Date(row.timestamp).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </TableCell>
                <TableCell>{row.vibration_01.toFixed(2)}</TableCell>
                <TableCell>{row.vibration_02.toFixed(2)}</TableCell>
                <TableCell>{row.vibration_03.toFixed(2)}</TableCell>
                <TableCell>{row.temperature.toFixed(2)}</TableCell>
                <TableCell>{row.rpm_1.toFixed(2)}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Chip
                      label={row.Failure_Type_Name}
                      size="small"
                      sx={{
                        ...CHIP_STYLES,
                        backgroundColor: getFailureTypeStyle(
                          row.Failure_Type_Name
                        ).backgroundColor,
                        color: getFailureTypeStyle(row.Failure_Type_Name).color,
                        fontWeight: 500,
                        textShadow: getFailureTypeStyle(row.Failure_Type_Name)
                          .textShadow,
                        border: "1px solid",
                        borderColor: "rgba(0, 0, 0, 0.1)",
                        "& .MuiChip-label": {
                          ...CHIP_STYLES["& .MuiChip-label"],
                          textShadow: getFailureTypeStyle(row.Failure_Type_Name)
                            .textShadow,
                        },
                        "&:hover": {
                          backgroundColor: getFailureTypeStyle(
                            row.Failure_Type_Name
                          ).backgroundColor,
                          opacity: 0.8,
                        },
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Analyze Failure">
                    <Button
                      startIcon={<AnalyticsIcon />}
                      variant="contained"
                      size="small"
                      onClick={() => handleAnalyze(row)}
                      sx={{
                        textTransform: "none",
                        boxShadow: "none",
                      }}
                    >
                      Analyze
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredData.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No data found for the selected range.
        </Alert>
      )}
    </Paper>
  );
}
