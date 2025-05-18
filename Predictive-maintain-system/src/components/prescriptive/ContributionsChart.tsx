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
    // .filter((feature) => feature !== "Failure_Type") // Exclude "Failure_Type" if it exists
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
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
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
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Contributions Pie Chart",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw; // The raw value of the dataset
            const percentage = ((value / total) * 100).toFixed(2); // Calculate percentage
            return `${context.label}: ${value} (${percentage}%)`; // Show value and percentage
          },
        },
      },
    },
  };

  return (
    <div className="w-[500px] h-[500px] file justify-center mb-5 mt-5">
      <Pie className="w-[500px] h-[500px]" data={data} options={options} />
    </div>
  );
};

export default ContributionsChart;
