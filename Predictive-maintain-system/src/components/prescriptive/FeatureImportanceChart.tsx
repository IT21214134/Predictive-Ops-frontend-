import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Fade,
  Stack,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { API_CONFIG } from "@/config/api";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface FeatureImportance {
  feature: string;
  importance: number;
}

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8BC34A",
  "#00ACC1",
  "#D4E157",
  "#BA68C8",
];

const FeatureImportanceChart: React.FC = () => {
  const [data, setData] = useState<FeatureImportance[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.featureImportance}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          setData(result.feature_importances);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feature importance data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight={220}
        py={4}
      >
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary" mt={2}>
          Loading feature importance...
        </Typography>
      </Box>
    );
  }

  // Calculate total importance to compute percentages
  const totalImportance = data.reduce((acc, item) => acc + item.importance, 0);

  // Prepare data for the Pie chart
  const chartData = {
    labels: data.map((item) => item.feature),
    datasets: [
      {
        label: "Feature Importance",
        data: data.map((item) => item.importance),
        backgroundColor: COLORS.slice(0, data.length),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Custom tooltip configuration and remove zoom animation
  const options = {
    animation: {
      animateRotate: true,
      animateScale: false, // disables zoom-out
      duration: 900,
      easing: "easeOutCubic" as
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
        | "easeInBack"
        | "easeOutBack"
        | "easeInOutBack"
        | undefined,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const value = tooltipItem.raw;
            const percentage = ((value / totalImportance) * 100).toFixed(1);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Fade in timeout={600}>
      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 4,
          width: "100%",
          maxWidth: 700,
          mx: "auto",
        }}
      >
        <Box sx={{ width: { xs: "100%", md: 320 }, height: 320 }}>
          <Pie data={chartData} options={options} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Feature Importance
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            This chart shows the relative importance of each feature used in the
            model.
          </Typography>
          <Stack spacing={1}>
            {data.map((item, idx) => (
              <Box
                key={item.feature}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: COLORS[idx % COLORS.length],
                    mr: 1,
                  }}
                />
                <Typography variant="body2" fontWeight={500}>
                  {item.feature}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: "auto" }}
                >
                  {((item.importance / totalImportance) * 100).toFixed(1)}%
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Paper>
    </Fade>
  );
};

export default FeatureImportanceChart;
