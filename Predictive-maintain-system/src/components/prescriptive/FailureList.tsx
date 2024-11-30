"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type FailureData = {
  connectionDeviceId: number;
  vibration_01: number;
  vibration_02: number;
  vibration_03: number;
  temperature: number;
  rpm_1: number;
  deviceID: string;
  timestamp: string;
  Target: number;
  Failure_Type_Name: string;
  Failure_Type: number;
};

const sampleData: FailureData[] = [
  {
    connectionDeviceId: 2938,
    vibration_01: 0.607506622,
    vibration_02: 0.398779797,
    vibration_03: 0.955583235,
    temperature: 35.80096162,
    rpm_1: 1345.515852,
    deviceID: "sensor-7",
    timestamp: "2024-10-19T18:32:00Z",
    Target: 1,
    Failure_Type_Name: "Trimmer Bearing Fault",
    Failure_Type: 1,
  },
  {
    connectionDeviceId: 2938,
    vibration_01: 3.268893673,
    vibration_02: 0.268893673,
    vibration_03: 0.955583235,
    temperature: 35.80096162,
    rpm_1: 1005.515852,
    deviceID: "sensor-7",
    timestamp: "2024-10-20T18:32:00Z",
    Target: 1,
    Failure_Type_Name: "Drill Issue",
    Failure_Type: 2,
  },
];

export default function FailureList() {
  const router = useRouter();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleAnalyze = (failureData: FailureData) => {
    router.push(
      `/analyzemy?data=${encodeURIComponent(JSON.stringify(failureData))}`
    );
  };

  const filteredData = sampleData.filter((row) => {
    const rowDate = new Date(row.timestamp);
    const start = startDate
      ? new Date(new Date(startDate).toISOString())
      : null;
    const end = endDate ? new Date(new Date(endDate).toISOString()) : null;

    return (!start || rowDate >= start) && (!end || rowDate <= end);
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Predicted Failure List</h1>
      <div className="flex flex-row justify-between">
        <div className="mb-4 flex gap-4 items-center align-middle">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date & Time (UTC)
            </label>
            <input
              type="datetime-local"
              className="border border-gray-300 rounded p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date & Time (UTC)
            </label>
            <input
              type="datetime-local"
              className="border border-gray-300 rounded p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Device ID</th>
              <th className="py-2 px-4 border-b">Timestamp (UTC)</th>
              <th className="py-2 px-4 border-b">Failure Type</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">
                  {row.deviceID}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {new Date(row.timestamp).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {row.Failure_Type_Name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleAnalyze(row)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Analyze
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
