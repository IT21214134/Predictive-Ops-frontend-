"use client";
import { FC } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Box, Typography, Stack } from "@mui/material";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface Contributions {
  [key: string]: number;
}

interface ContributionsChartProps {
  contributions_percent: {
    [key: string]: number;
  };
}

// Map backend keys to display labels
const FEATURE_MAP = [
  { key: "RPM_Sensor_01", label: "Rotational speed" },
  { key: "Temperature_01", label: "Temperature" },
  { key: "Vibration_01", label: "Vibration from sensor 1" },
  { key: "Vibration_02", label: "Vibration from sensor 2" },
  { key: "Vibration_03", label: "Vibration from sensor 3" },
];

const COLORS = [
  "rgba(255, 99, 132, 0.6)",
  "rgba(54, 162, 235, 0.6)",
  "rgba(255, 206, 86, 0.6)",
  "rgba(75, 192, 192, 0.6)",
  "rgba(153, 102, 255, 0.6)",
];

const BORDER_COLORS = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
];

const ContributionsChart: FC<ContributionsChartProps> = ({
  contributions_percent,
}) => {
  // Map backend keys to display order and labels
  const dataValues = FEATURE_MAP.map((item) =>
    contributions_percent[item.key] !== undefined
      ? Number(contributions_percent[item.key])
      : 0
  );
  const labels = FEATURE_MAP.map((item) => item.label);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: COLORS,
        borderColor: BORDER_COLORS,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = Number(context.raw).toFixed(2);
            return `${context.label}: ${value}%`;
          },
        },
      },
    },
    animation: false,
    maintainAspectRatio: false,
  };

  return (
    <Box
      sx={{
        width: 480, // Increased width for more space
        height: 360,
        mx: "auto",
        minWidth: 340,
        maxWidth: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6, // Increased gap between chart and legend
        py: 3, // More vertical padding
      }}
    >
      <Box
        sx={{
          width: 200, // Increased chart box width
          height: 200,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pie data={data} options={options} height={200} width={200} />
      </Box>
      <Stack
        direction="column"
        spacing={2}
        sx={{
          width: "100%", // Slightly more width for legend
          maxWidth: "100%",
          minWidth: 180,
          pl: 3,
        }}
      >
        {FEATURE_MAP.map((item, idx) => (
          <Box
            key={item.key}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              width: "345px",
              py: 1,
              whiteSpace: "nowrap", // Prevent label from wrapping
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                bgcolor: COLORS[idx],
                mr: 2,
                border: "1px solid #eee",
                flexShrink: 0,
              }}
            />
            <Typography
              variant="body1"
              fontWeight={500}
              sx={{
                flex: 1,
                whiteSpace: "nowrap", // Prevent label from wrapping
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 200, // Ensure label has enough space
                fontSize: "0.875rem", // Smaller font size for better fit
              }}
              title={item.label}
            >
              {item.label}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ ml: 2, minWidth: 48, textAlign: "right", flexShrink: 0 }}
            >
              {dataValues[idx].toFixed(2)}%
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ContributionsChart;
