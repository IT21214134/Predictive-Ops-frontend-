import React, { useEffect, useState } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface FeatureImportance {
  feature: string;
  importance: number;
}

const FeatureImportanceChart: React.FC = () => {
  const [data, setData] = useState<FeatureImportance[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    fetch("http://127.0.0.1:5001/model/feature-importance")
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
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Calculate total importance to compute percentages
  const totalImportance = data.reduce((acc, item) => acc + item.importance, 0);

  // Prepare data for the Pie chart
  const chartData = {
    labels: data.map(
      (item) =>
        `${item.feature} (${((item.importance / totalImportance) * 100).toFixed(
          1
        )}%)`
    ),
    datasets: [
      {
        label: "Feature Importance",
        data: data.map((item) => item.importance),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        borderColor: ["#FFFFFF"],
        borderWidth: 1,
      },
    ],
  };

  // Custom tooltip configuration
  const options = {
    plugins: {
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
    <Box
      className="mb-20"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 4,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Feature Importance Visualization
      </Typography>
      <Box width="80%" maxWidth="600px">
        <Pie data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default FeatureImportanceChart;
