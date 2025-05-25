"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Tab,
  Tabs,
  Container,
  Card,
  CardContent,
} from "@mui/material";

import React from "react";
import PrescriptiveLayout from "../layout";
import FailureList from "@/components/prescriptive/FailureList";
import { loadData, loadMetrics } from "../../../app/data/data";
// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface DataRow {
  Failure_Type_Name: any;
  vibration_1: number;
  vibration_2: number;
  vibration_3: number;
  temperature: number;
  rpm_1: number;
  Target: number;
  Failure_Flag: number;
}

interface PerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

const TechnicalDashboard = ({
  data,
  performance,
}: {
  data: DataRow[];
  performance: PerformanceMetrics;
}) => {
  const failureFlagDistribution = data.reduce<Record<number, number>>(
    (acc, row) => {
      acc[row.Failure_Type_Name] = (acc[row.Failure_Type_Name] || 0) + 1;
      return acc;
    },
    {}
  );

  const failureFlagData = {
    labels: Object.keys(failureFlagDistribution),
    datasets: [
      {
        label: "Failure Flag Distribution",
        data: Object.values(failureFlagDistribution),
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#2196F3"],
        borderColor: ["#388E3C", "#FFA000", "#D32F2F", "#1976D2"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
          Technical Dashboard
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Failure Distribution Analysis
                </Typography>
                <Box sx={{ height: 400 }}>
                  <Bar
                    data={failureFlagData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Performance Metrics
                </Typography>
                <Grid container spacing={2}>
                  {["accuracy", "precision", "recall", "f1_score"].map(
                    (key) => (
                      <Grid item xs={6} key={key}>
                        <Card variant="outlined" sx={{ bgcolor: "#f5f5f5" }}>
                          <CardContent>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
                              {key.toUpperCase()}
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ mt: 1, color: "#1976d2" }}
                            >
                              {(
                                performance[key as keyof PerformanceMetrics] *
                                100
                              ).toFixed(1)}
                              %
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

interface NonTechnicalDashboardProps {
  data: DataRow[];
  performance: PerformanceMetrics;
  riskLevel: string;
}
const NonTechnicalDashboard = ({
  data,
  performance,
  riskLevel,
}: NonTechnicalDashboardProps) => {
  const failureFlagDistribution = data.reduce<Record<string, number>>(
    (acc, row) => {
      acc[row.Failure_Type_Name] = (acc[row.Failure_Type_Name] || 0) + 1;
      return acc;
    },
    {}
  );

  const failureFlagData = {
    labels: Object.keys(failureFlagDistribution),
    datasets: [
      {
        label: "Machine Failure Frequency",
        data: Object.values(failureFlagDistribution),
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
        borderColor: ["#388E3C", "#FFA000", "#D32F2F"],
        borderWidth: 1,
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return { bg: "#E8F5E9", text: "#2E7D32" };
      case "Moderate":
        return { bg: "#FFF3E0", text: "#F57C00" };
      case "Critical":
        return { bg: "#FFEBEE", text: "#C62828" };
      default:
        return { bg: "#E8F5E9", text: "#2E7D32" };
    }
  };

  const statusColor = getStatusColor(riskLevel);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
          System Overview
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", bgcolor: statusColor.bg }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  System Health Status
                </Typography>
                <Typography
                  variant="h2"
                  sx={{ color: statusColor.text, mb: 2 }}
                >
                  {riskLevel}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Current operational condition
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Success Rate
                </Typography>
                <Typography variant="h2" sx={{ color: "#1976d2", mb: 2 }}>
                  {(performance.accuracy * 100 || 0).toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Prediction accuracy rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Risk Assessment
                </Typography>
                <Typography variant="h2" sx={{ color: "#f57c00", mb: 2 }}>
                  {(
                    (Object.values(failureFlagDistribution).reduce<number>(
                      (a: number) => a,
                      1
                    ) /
                      data.length) *
                      100 || 0
                  ).toFixed(1)}
                  %
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Potential failure probability
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Failure Type Analysis
                </Typography>
                <Box sx={{ height: 400 }}>
                  <Bar
                    data={failureFlagData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default function Dashboard() {
  const [data, setData] = useState<DataRow[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1_score: 0,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [riskLevel, setRiskLevel] = useState("Good");

  // Update the useEffect to properly load data using the loadData and loadMetrics functions
  useEffect(() => {
    async function fetchData() {
      try {
        // Try to load data and metrics concurrently
        const [newData, newMetrics] = await Promise.allSettled([
          loadData(),
          loadMetrics(),
        ]);

        // Handle data loading result
        if (newData.status === "fulfilled") {
          setData(newData.value);
        } else {
          console.error("Failed to load data:", newData.reason);
          setData([]);
        }

        // Handle metrics loading result
        if (newMetrics.status === "fulfilled") {
          setPerformance(newMetrics.value);
        } else {
          console.error("Failed to load metrics:", newMetrics.reason);
          setPerformance({
            accuracy: 0,
            precision: 0,
            recall: 0,
            f1_score: 0,
          });
        }

        // Calculate risk level from available data
        if (newData.status === "fulfilled") {
          const failureCounts: Record<number, number> = newData.value.reduce(
            (acc: Record<number, number>, row) => {
              acc[row.Failure_Flag] = (acc[row.Failure_Flag] || 0) + 1;
              return acc;
            },
            {}
          );

          const highFailures = Object.keys(failureCounts).filter(
            (flag) => Number(flag) > 3
          ).length;

          setRiskLevel(
            highFailures > 2
              ? "Critical"
              : highFailures > 0
              ? "Moderate"
              : "Good"
          );
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Initialize with empty data in case of error
        setData([]);
        setPerformance({
          accuracy: 0,
          precision: 0,
          recall: 0,
          f1_score: 0,
        });
        setRiskLevel("Good");
      }
    }

    fetchData();
  }, []);

  return (
    <PrescriptiveLayout>
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Container maxWidth="xl" sx={{ pt: 3, pb: 6 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab label="System Overview" />
                <Tab label="Detailed Analysis" />
              </Tabs>
            </CardContent>
          </Card>

          {activeTab === 0 ? (
            <NonTechnicalDashboard
              data={data}
              performance={performance}
              riskLevel={riskLevel}
            />
          ) : (
            <TechnicalDashboard data={data} performance={performance} />
          )}

          <Card sx={{ mt: 4 }}>
            <CardContent>
              <FailureList />
            </CardContent>
          </Card>
        </Container>
      </Box>
    </PrescriptiveLayout>
  );
}
