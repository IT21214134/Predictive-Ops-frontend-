"use client";
import ContributionsChart from "@/components/prescriptive/ContributionsChart";
import { fetchContributions } from "@/services/api";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Contributions {
  [feature: string]: number[];
}

interface ContributionData {
  contributions: Contributions;
}

export default function AnalyzeFailurePage() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  const failureDataPassed = React.useMemo(() => {
    if (data) {
      try {
        return JSON.parse(decodeURIComponent(data as string));
      } catch (error) {
        console.error("Failed to parse failure data:", error);
        return null;
      }
    }
    return null;
  }, [data]);

  const [possibleCauses, setPossibleCauses] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<string[]>([]);
  const [additionalObservations] = useState<string>("");
  const [contributionData, setContributionData] =
    useState<ContributionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getContributions = async () => {
      try {
        const data = await fetchContributions(failureDataPassed);
        setContributionData(data);
      } catch (error) {
        console.error("Error fetching contributions:", error);
      } finally {
        setLoading(false);
      }
    };

    getContributions();
  }, []);

  useEffect(() => {
    if (failureDataPassed) {
      const failureType = failureDataPassed.type;
      const failureData = failureCausesData[failureType];

      if (failureData) {
        setPossibleCauses(failureData.causes);
        setSolutions(failureData.solutions);
      }
    }
  }, [failureDataPassed]);

  const failureCausesData: Record<
    string,
    { causes: string[]; solutions: string[] }
  > = {
    "Drill Failure": {
      causes: [
        "Worn out drill bits",
        "Improper speed settings",
        "Material hardness mismatch",
      ],
      solutions: [
        "Replace drill bits",
        "Adjust speed settings",
        "Use appropriate drill bit for material",
      ],
    },
    "Motor Failure": {
      causes: [
        "Overheating",
        "Bearing wear",
        "Electrical issues",
        "Lack of lubrication",
      ],
      solutions: [
        "Improve cooling",
        "Replace bearings",
        "Check electrical connections",
        "Apply proper lubrication",
      ],
    },
    "Pump Failure": {
      causes: [
        "Cavitation",
        "Seal failure",
        "Impeller damage",
        "Suction problems",
      ],
      solutions: [
        "Check inlet conditions",
        "Replace seals",
        "Inspect/replace impeller",
        "Verify suction line",
      ],
    },
  };

  if (!failureDataPassed) {
    return <p>Error: Invalid or missing failure data.</p>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Failure Analysis Results</h1>
      {contributionData && (
        <ContributionsChart contributions={contributionData.contributions} />
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Possible Causes</h2>
        <ul className="list-disc pl-6 mb-6">
          {possibleCauses.map((cause, index) => (
            <li key={index} className="mb-2">
              {cause}
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Recommended Solutions</h2>
        <ul className="list-disc pl-6 mb-6">
          {solutions.map((solution, index) => (
            <li key={index} className="mb-2">
              {solution}
            </li>
          ))}
        </ul>

        {additionalObservations && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Additional Observations
            </h2>
            <p className="text-gray-700">{additionalObservations}</p>
          </div>
        )}
      </div>
    </div>
  );
}
