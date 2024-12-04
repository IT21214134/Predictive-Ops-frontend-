"use client";
import React, { useState } from "react";
import LineChart from "./LineCharts";

interface PairwiseLineChartsProps {
  dataset: { [key: string]: any };
}

const PairwiseLineCharts: React.FC<PairwiseLineChartsProps> = ({ dataset }) => {
  const [selectedVars, setSelectedVars] = useState(["Variable1", "Variable2"]);

  const handleSelectionChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setSelectedVars((prev) => ({ ...prev, [name]: value }));
  };

  const variableOptions = Object.keys(dataset);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pairwise Comparisons</h1>
      <div className="mb-4">
        <label>
          Variable 1:
          <select
            name="var1"
            value={selectedVars[0]}
            onChange={handleSelectionChange}
          >
            {variableOptions.map((varName) => (
              <option key={varName} value={varName}>
                {varName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Variable 2:
          <select
            name="var2"
            value={selectedVars[1]}
            onChange={handleSelectionChange}
          >
            {variableOptions.map((varName) => (
              <option key={varName} value={varName}>
                {varName}
              </option>
            ))}
          </select>
        </label>
      </div>
      <LineChart
        variable1={selectedVars[0]}
        variable2={selectedVars[1]}
        data={dataset}
      />
    </div>
  );
};

export default PairwiseLineCharts;
