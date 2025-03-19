"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  variable1: string;
  variable2: string;
  data: { [key: string]: number[] };
}

const LineChart = ({ variable1, variable2, data }: LineChartProps) => {
  const chartData = {
    labels: Array.from({ length: data[variable1].length }, (_, i) => i + 1), // x-axis (e.g., time steps)
    datasets: [
      {
        label: variable1,
        data: data[variable1],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        fill: true,
      },
      {
        label: variable2,
        data: data[variable2],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Comparison: ${variable1} vs ${variable2}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Observations",
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
