"use client";
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  ScriptableContext,
} from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";
import { fetchCorrelationMatrix } from "@/services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  MatrixController,
  MatrixElement
);

const CorrelationHeatmap = () => {
  const [correlationMatrix, setCorrelationMatrix] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCorrelationMatrix();
      setCorrelationMatrix(data);
    };

    fetchData();
  }, []);

  if (!correlationMatrix) {
    return <div>Loading...</div>;
  }

  const labels = Object.keys(correlationMatrix);
  const dataMatrix: {
    x: number; // Column index
    y: number; // Row index
    value: never;
  }[] = [];

  labels.forEach((row, rowIndex) => {
    labels.forEach((col, colIndex) => {
      dataMatrix.push({
        x: colIndex, // Column index
        y: rowIndex, // Row index
        value: correlationMatrix[row][col],
      });
    });
  });

  // Prepare Chart.js data object
  const data = {
    datasets: [
      {
        label: "Correlation Heatmap",
        data: dataMatrix,
        backgroundColor: (context: ScriptableContext<"matrix">) => {
          const value = (context.raw as { value: number }).value;
          // Gradient: Blue (-1), White (0), Red (+1)
          const color =
            value < 0
              ? `rgba(0, 0, 255, ${Math.abs(value)})`
              : `rgba(255, 0, 0, ${Math.abs(value)})`;
          return color;
        },
        borderWidth: 1,
        width: ({ chart }: { chart: ChartJS }) => {
          const chartArea = chart.chartArea || { width: 500 }; // Fallback
          return chartArea.width / 10; // Example: Adjust based on number of cells
        },
        height: ({ chart }: { chart: ChartJS }) => {
          const chartArea = chart.chartArea || { height: 500 }; // Fallback
          return chartArea.height / 10;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) =>
            `Correlation: ${(
              tooltipItem.raw as { value: number }
            ).value.toFixed(2)}`,
        },
      },
      title: {
        display: true,
        text: "Correlation Heatmap",
      },
    },
    scales: {
      x: {
        type: "category" as const,
        labels: labels,
        title: {
          display: true,
          text: "Variables",
        },
      },
      y: {
        type: "category" as const,
        labels: labels,
        title: {
          display: true,
          text: "Variables",
        },
      },
    },
  };

  return (
    <>
      <div style={{ width: "700px", height: "500px", margin: "0 auto" }}>
        <h1 className="text-3xl font-bold mb-4">Correlation Analysis</h1>
        <Chart type="matrix" data={data} options={options} />
      </div>

      {/* <PairwiseLineCharts
        dataset={{
          Variable1: [12, 15, 20, 25, 18, 17, 30, 35, 40, 45],
          Variable2: [8, 10, 12, 15, 13, 14, 20, 22, 25, 28],
          Variable3: [50, 45, 40, 35, 30, 25, 20, 15, 10, 5],
          Variable4: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
        }}
      /> */}
    </>
  );
};

export default CorrelationHeatmap;
