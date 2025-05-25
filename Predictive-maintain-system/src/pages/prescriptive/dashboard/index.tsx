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
  Skeleton,
  LinearProgress,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  Analytics,
  Dashboard as DashboardIcon,
  InfoOutlined,
} from "@mui/icons-material";

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

  const METRIC_DESCRIPTIONS = {
    accuracy: {
      label: "Accuracy",
      description: "Overall correctness of predictions",
      tooltip: "Percentage of correct predictions out of all predictions made",
    },
    precision: {
      label: "Precision",
      description: "Reliability of failure predictions",
      tooltip:
        "Percentage of correct failure predictions out of all failure predictions",
    },
    recall: {
      label: "Recall",
      description: "Detection rate of actual failures",
      tooltip: "Percentage of actual failures that were correctly predicted",
    },
    f1_score: {
      label: "F1 Score",
      description: "Overall model performance",
      tooltip: "Balanced measure between precision and recall (0-100%)",
    },
  } as const;

  // Custom chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeInOutQuart" as
        | "linear"
        | "easeInQuad"
        | "easeOutQuad"
        | "easeInOutQuad"
        | "easeInCubic"
        | "easeOutCubic"
        | "easeInOutCubic"
        | "easeInQuart"
        | "easeOutQuart"
        | "easeInOutQuart"
        | "easeInQuint"
        | "easeOutQuint"
        | "easeInOutQuint"
        | "easeInSine"
        | "easeOutSine"
        | "easeInOutSine"
        | "easeInExpo"
        | "easeOutExpo"
        | "easeInOutExpo"
        | "easeInCirc"
        | "easeOutCirc"
        | "easeInOutCirc"
        | "easeInElastic"
        | "easeOutElastic"
        | "easeInOutElastic"
        | "easeInBack"
        | "easeOutBack"
        | "easeInOutBack"
        | "easeInBounce"
        | "easeOutBounce"
        | "easeInOutBounce"
        | undefined,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          padding: 20,
          font: {
            size: 13,
            weight: 500,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: alpha("#fff", 0.9),
        titleColor: "#000",
        bodyColor: "#666",
        bodyFont: { size: 13 },
        borderColor: "#e1e4e8",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: alpha("#000", 0.05),
          drawBorder: false,
        },
        ticks: {
          padding: 10,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 10,
        },
      },
    },
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}
        >
          Detailed Analysis
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                height: "100%",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: (theme) =>
                    `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    gap: 1,
                  }}
                >
                  <Typography variant="h6">
                    Failure Distribution Analysis
                  </Typography>
                  <Tooltip title="Shows the distribution of different types of failures detected by the system">
                    <InfoOutlined
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    height: 400,
                    position: "relative",
                    ".canvas-container": {
                      transition: "opacity 0.3s ease-in-out",
                    },
                  }}
                >
                  <Bar
                    data={{
                      ...failureFlagData,
                      datasets: [
                        {
                          ...failureFlagData.datasets[0],
                          borderRadius: 6,
                          maxBarThickness: 50,
                          backgroundColor: [
                            alpha("#00695c", 0.8),
                            alpha("#f9a825", 0.8),
                            alpha("#5E35B1", 0.8),
                          ],
                          borderColor: ["#00695c", "#f9a825", "#5E35B1"],
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    gap: 1,
                  }}
                >
                  <Typography variant="h6">Performance Metrics</Typography>
                  <Tooltip title="Key performance indicators of the prediction model">
                    <InfoOutlined
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                  </Tooltip>
                </Box>
                <Grid container spacing={2}>
                  {Object.entries(METRIC_DESCRIPTIONS).map(([key, info]) => (
                    <Grid item xs={6} key={key}>
                      <Tooltip title={info.tooltip} arrow placement="top">
                        <Card
                          variant="outlined"
                          sx={{
                            bgcolor: alpha("#f5f5f5", 0.3),
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              bgcolor: alpha("#f5f5f5", 0.5),
                              transform: "translateY(-2px)",
                            },
                            border: "1px solid",
                            borderColor: alpha("#000", 0.08),
                          }}
                        >
                          <CardContent>
                            <Box sx={{ mb: 1 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: alpha("#000", 0.7),
                                  textTransform: "capitalize",
                                  fontWeight: 500,
                                }}
                              >
                                {info.label}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: alpha("#000", 0.5),
                                  display: "block",
                                  mt: 0.5,
                                }}
                              >
                                {info.description}
                              </Typography>
                            </Box>
                            <Typography
                              variant="h4"
                              sx={{
                                color: alpha("#1976d2", 0.85),
                                fontWeight: 600,
                              }}
                            >
                              {(
                                performance[key as keyof PerformanceMetrics] *
                                100
                              ).toFixed(1)}
                              %
                            </Typography>
                          </CardContent>
                        </Card>
                      </Tooltip>
                    </Grid>
                  ))}
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
  isLoading?: boolean; // Add this prop
}

const NonTechnicalDashboard = ({
  data,
  performance,
  riskLevel,
  isLoading = false, // Add default value
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
        return {
          bg: "#E8F5E9",
          text: "#2E7D32",
          icon: "✓",
          shadow: "0 2px 8px rgba(46, 125, 50, 0.15)",
        };
      case "Moderate":
        return {
          bg: "#FFF3E0",
          text: "#F57C00",
          icon: "⚠️",
          shadow: "0 2px 8px rgba(245, 124, 0, 0.15)",
        };
      case "Critical":
        return {
          bg: "#EDE7F6",
          text: "#5E35B1",
          icon: "⚡",
          shadow: "0 2px 8px rgba(94, 53, 177, 0.15)",
        };
      default:
        return {
          bg: "#E8F5E9",
          text: "#2E7D32",
          icon: "✓",
          shadow: "0 2px 8px rgba(46, 125, 50, 0.15)",
        };
    }
  };

  const statusColor = getStatusColor(riskLevel);

  const renderMetricValue = (value: number | string, height = 60) => {
    if (isLoading) {
      return (
        <Skeleton
          variant="rectangular"
          height={height}
          sx={{ borderRadius: 1 }}
        />
      );
    }
    return value;
  };

  // Define chartOptions for NonTechnicalDashboard
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeInOutQuart" as
        | "linear"
        | "easeInQuad"
        | "easeOutQuad"
        | "easeInOutQuad"
        | "easeInCubic"
        | "easeOutCubic"
        | "easeInOutCubic"
        | "easeInQuart"
        | "easeOutQuart"
        | "easeInOutQuart"
        | "easeInQuint"
        | "easeOutQuint"
        | "easeInOutQuint"
        | "easeInSine"
        | "easeOutSine"
        | "easeInOutSine"
        | "easeInExpo"
        | "easeOutExpo"
        | "easeInOutExpo"
        | "easeInCirc"
        | "easeOutCirc"
        | "easeInOutCirc"
        | "easeInElastic"
        | "easeOutElastic"
        | "easeInOutElastic"
        | "easeInBack"
        | "easeOutBack"
        | "easeInOutBack"
        | "easeInBounce"
        | "easeOutBounce"
        | "easeInOutBounce"
        | undefined,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          padding: 20,
          font: {
            size: 13,
            weight: 500,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: alpha("#fff", 0.9),
        titleColor: "#000",
        bodyColor: "#666",
        bodyFont: { size: 13 },
        borderColor: "#e1e4e8",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: alpha("#000", 0.05),
          drawBorder: false,
        },
        ticks: {
          padding: 10,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 10,
        },
      },
    },
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ pb: 4 }}>
        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}
        >
          System Overview
        </Typography>
        <Grid container spacing={4}>
          {/* System Health Status Card */}
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
                  {renderMetricValue(riskLevel)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Current operational condition
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Success Rate Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Success Rate
                </Typography>
                <Typography variant="h2" sx={{ color: "#1976d2", mb: 2 }}>
                  {renderMetricValue(
                    `${(performance.accuracy * 100 || 0).toFixed(1)}%`
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Prediction accuracy rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Risk Assessment Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Risk Assessment
                </Typography>
                <Typography variant="h2" sx={{ color: "#f57c00", mb: 2 }}>
                  {renderMetricValue(
                    `${(100 - (performance.accuracy * 100 || 0)).toFixed(1)}%`
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Potential failure probability
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    gap: 1,
                  }}
                >
                  <Typography variant="h6">Failure Type Analysis</Typography>
                  <Tooltip title="Distribution of different failure types across the system">
                    <InfoOutlined
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    height: 400,
                    position: "relative",
                    ".canvas-container": {
                      transition: "opacity 0.3s ease-in-out",
                    },
                  }}
                >
                  <Bar
                    data={{
                      ...failureFlagData,
                      datasets: [
                        {
                          ...failureFlagData.datasets[0],
                          borderRadius: 6,
                          maxBarThickness: 100,
                          backgroundColor: [
                            alpha("#00695c", 0.8),
                            alpha("#f9a825", 0.8),
                            alpha("#5E35B1", 0.8),
                          ],
                          borderColor: ["#00695c", "#f9a825", "#5E35B1"],
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={chartOptions}
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
  const [isLoading, setIsLoading] = useState(true);

  // Update the useEffect to properly load data using the loadData and loadMetrics functions
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <PrescriptiveLayout>
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Container maxWidth="xl" sx={{ pt: 3, pb: 6 }}>
          {/* Enhanced Tab Navigation */}
          <Card
            sx={{
              mb: 3,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {isLoading && (
                <LinearProgress
                  sx={{
                    position: "absolute",
                    width: "100%",
                    top: 0,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
              )}
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTab-root": {
                    minHeight: 64,
                    fontSize: "1rem",
                    textTransform: "none",
                    fontWeight: 500,
                  },
                }}
                variant="fullWidth"
              >
                <Tab
                  label="System Overview"
                  icon={<DashboardIcon />}
                  iconPosition="start"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                  }}
                />
                <Tab
                  label="Detailed Analysis"
                  icon={<Analytics />}
                  iconPosition="start"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                  }}
                />
              </Tabs>
            </CardContent>
          </Card>

          {/* Animated Tab Panels */}
          <Box
            sx={{
              transition: "opacity 0.3s ease-in-out",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {activeTab === 0 ? (
              <NonTechnicalDashboard
                data={data}
                performance={performance}
                riskLevel={riskLevel}
                isLoading={isLoading}
              />
            ) : (
              <TechnicalDashboard data={data} performance={performance} />
            )}
          </Box>

          {/* Failure List Section */}
          <Card
            sx={{
              mt: 4,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Recent Failures
              </Typography>
              <FailureList />
            </CardContent>
          </Card>
        </Container>
      </Box>
    </PrescriptiveLayout>
  );
}
