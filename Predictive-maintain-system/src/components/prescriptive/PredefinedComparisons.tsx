import LineChart from "./LineCharts";

interface PredefinedComparisonsProps {
  dataset: { [key: string]: number[] };
  pairs: [string, string][];
}

export const PredefinedComparisons = ({
  dataset,
  pairs,
}: PredefinedComparisonsProps) => (
  <div>
    {pairs.map(([var1, var2], index) => (
      <div key={index} style={{ marginBottom: "20px" }}>
        <LineChart variable1={var1} variable2={var2} data={dataset} />
      </div>
    ))}
  </div>
);
