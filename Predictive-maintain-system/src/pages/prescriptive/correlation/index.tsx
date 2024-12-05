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
import PairwiseLineCharts from "@/components/prescriptive/PairwiseLineCharts";

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
        x: colIndex,
        y: rowIndex,
        value: correlationMatrix[row][col],
      });
    });
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title() {
            return "";
          },
          label(context: any) {
            const v = context.dataset.data[context.dataIndex];
            return [
              `${labels[v.x]} vs ${labels[v.y]}:`,
              `Correlation: ${v.value.toFixed(2)}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        labels: labels,
        ticks: {
          display: true,
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: "category",
        labels: labels,
        offset: true,
        ticks: {
          display: true,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        label: "Correlation Matrix",
        data: dataMatrix,
        backgroundColor(context: ScriptableContext<"matrix">) {
          const value = context.dataset.data[context.dataIndex].value;
          const alpha = Math.abs(value);
          return value > 0
            ? `rgba(0, 0, 255, ${alpha})`
            : `rgba(255, 0, 0, ${alpha})`;
        },
        borderColor(context: ScriptableContext<"matrix">) {
          const value = context.dataset.data[context.dataIndex].value;
          const alpha = Math.abs(value);
          return value > 0
            ? `rgba(0, 0, 255, ${alpha})`
            : `rgba(255, 0, 0, ${alpha})`;
        },
        borderWidth: 1,
        width: ({ chart }: any) => {
          return (chart.chartArea || {}).width / labels.length - 1;
        },
        height: ({ chart }: any) => {
          return (chart.chartArea || {}).height / labels.length - 1;
        },
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Correlation Analysis</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Correlation Heatmap</h2>
        <div style={{ height: "600px" }}>
          <Chart type="matrix" options={options} data={data} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Pairwise Comparisons</h2>
        <PairwiseLineCharts dataset={{}} />
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
