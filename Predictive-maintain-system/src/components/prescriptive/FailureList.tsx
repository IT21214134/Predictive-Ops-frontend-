"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";

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

export default function FailureList() {
  const router = useRouter();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [csvData, setCsvData] = useState<FailureData[]>([]);

  useEffect(() => {
    // Load and parse the CSV file
    const fetchData = async () => {
      try {
        const response = await fetch("/dataset.csv");
        const csvText = await response.text();

        // Parse CSV data using PapaParse
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (result) => {
            const parsedData: FailureData[] = result.data
              .map((row: any) => ({
                connectionDeviceId: row.connectionDeviceId,
                vibration_01: row.Vibration_01,
                vibration_02: row.Vibration_02,
                vibration_03: row.Vibration_03,
                temperature: row.Temperature_01,
                rpm_1: row.RPM_Sensor_01,
                deviceID: row.deviceID,
                timestamp: row.timestamp,
                Target: row.Target,
                Failure_Type: row.Failure_Type,
                Failure_Type_Name: row.Failure_Type_Encoded,
              }))
              .filter(
                (row) =>
                  row.Target !== 0 && row.Failure_Type_Name !== "No Failure"
              );

            setCsvData(parsedData);
          },
        });
      } catch (error) {
        console.error("Error loading CSV file:", error);
      }
    };

    fetchData();
  }, []);

  const handleAnalyze = (failureData: FailureData) => {
    router.push(
      `/prescriptive/analyzemy?data=${encodeURIComponent(JSON.stringify(failureData))}`
    );
    localStorage.setItem("failureData", JSON.stringify(failureData));
  };

  const filteredData = csvData
    .filter((row) => {
      const rowDate = new Date(row.timestamp);
      const start = startDate
        ? new Date(new Date(startDate).toISOString())
        : null;
      const end = endDate ? new Date(new Date(endDate).toISOString()) : null;

      return (!start || rowDate >= start) && (!end || rowDate <= end);
    })
    // Limit the filtered data to 20 records
    .slice(0, 20);

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
            className="mt-5 bg-gray-600 text-white px-4 py-2 rounded"
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="table-auto w-full border-collapse border border-gray-300 text-left">
        <thead className="bg-gray-200">
          <tr>
            {/* <th className="border border-gray-300 p-2">Device ID</th> */}
            <th className="border border-gray-300 p-2">Vibration 1</th>
            <th className="border border-gray-300 p-2">Vibration 2</th>
            <th className="border border-gray-300 p-2">Vibration 3</th>
            <th className="border border-gray-300 p-2">Temperature</th>
            <th className="border border-gray-300 p-2">RPM 1</th>
            <th className="border border-gray-300 p-2">Failure Type</th>
            <th className="border border-gray-300 p-2">Timestamp</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr
              key={row.connectionDeviceId}
              className="odd:bg-white even:bg-gray-100"
            >
              {/* <td className="border border-gray-300 p-2">
                {row.connectionDeviceId}
              </td> */}
              <td className="border border-gray-300 p-2">
                {row.vibration_01.toFixed(2)}
              </td>
              <td className="border border-gray-300 p-2">
                {row.vibration_02.toFixed(2)}
              </td>
              <td className="border border-gray-300 p-2">
                {row.vibration_03.toFixed(2)}
              </td>
              <td className="border border-gray-300 p-2">
                {row.temperature.toFixed(2)}
              </td>
              <td className="border border-gray-300 p-2">
                {row.rpm_1.toFixed(2)}
              </td>
              <td className="border border-gray-300 p-2">
                {row.Failure_Type_Name}
              </td>
              <td className="border border-gray-300 p-2">
                {new Date(row.timestamp).toLocaleString()}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded mx-2 my-2"
                  onClick={() => handleAnalyze(row)}
                >
                  Analyze Failure
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No data found for the selected range.
        </p>
      )}
    </div>
  );
}
