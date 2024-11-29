"use client";
import { FC } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface Contributions {
  [key: string]: number[];
}

interface ContributionsChartProps {
  contributions: Contributions;
}

const ContributionsChart: FC<ContributionsChartProps> = ({ contributions }) => {
  // Aggregate the contributions into a format suitable for a pie chart
  const aggregatedData = Object.keys(contributions)
    .map((feature) => ({
      label: feature,
      value: contributions[feature].reduce((sum, value) => sum + value, 0), // Sum all values for the feature
    }));

  const total = aggregatedData.reduce((sum, entry) => sum + entry.value, 0);

  // Prepare data for the Pie chart
  const data = {
    labels: [
      "Rotational speed",
      "Temperature",
      "Vibration from sensor 1",
      "Vibration from sensor 2",
      "Vibration from sensor 3",
    ],
    datasets: [
      {
        data: aggregatedData.map((entry) => entry.value),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Feature Contributions",
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default ContributionsChart;