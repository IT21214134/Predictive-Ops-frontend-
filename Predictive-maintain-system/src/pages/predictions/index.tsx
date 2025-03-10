import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NAVBAR from "@/components/navBar";
import { useRealTimeData } from "../../components/RealTimeDataContext";
import {
  collection,
  getDocs,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { app } from "../../../firebaseconfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const firestore = getFirestore(app);

function SchedulePage() {
  const router = useRouter();
  const { data: realTimeData } = useRealTimeData();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [failureTypeData, setFailureTypeData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [sensorValues, setSensorValues] = useState({
    vibration_1: "",
    vibration_2: "",
    vibration_3: "",
    temperature: "",
    rpm_1: "",
  });

  useEffect(() => {
    if (realTimeData) {
      const updatedValues = {
        vibration_1: realTimeData.vibration_1?.toString() || "",
        vibration_2: realTimeData.vibration_2?.toString() || "",
        vibration_3: realTimeData.vibration_3?.toString() || "",
        temperature: realTimeData.temperature?.toString() || "",
        rpm_1: realTimeData.rpm_1?.toString() || "",
      };

      setSensorValues(updatedValues);
    }
  }, [realTimeData]);

  useEffect(() => {
    const fetchPredictions = async () => {
      const predictionsRef = collection(firestore, `Prediction/`);
      const snapshot = await getDocs(predictionsRef);
      const fetchedPredictions = snapshot.docs.map((doc) => {
        const data = doc.data();
        const timestamp =
          data.timestamp instanceof Timestamp ? data.timestamp.toDate() : null;
        return {
          id: doc.id,
          predicted_target: data.prediction_result?.predicted_target,
          predicted_failure_type:
            data.prediction_result?.predicted_failure_type,
          status: data.status,
          timestamp: timestamp,
        };
      });

      setPredictions(fetchedPredictions);
      processGraphData(fetchedPredictions);
    };

    fetchPredictions();
  }, []);

  const processGraphData = (data: any[]) => {
    const now = new Date();
    const last12Months = new Array(12)
      .fill(0)
      .map((_, i) => {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
          month: month.toLocaleString("default", { month: "short" }),
          count: 0,
        };
      })
      .reverse();

    const failureTypes = {
      "No Failure": 0,
      "Drill Issue": 0,
      "Trimmer Bearing Fault": 0,
    };
    const statusCounts: { [key: string]: number } = { true: 0, false: 0 };

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    data.forEach(
      ({
        timestamp,
        predicted_failure_type,
        status,
      }: {
        timestamp: Date;
        predicted_failure_type:
          | "No Failure"
          | "Drill Issue"
          | "Trimmer Bearing Fault";
        status: boolean;
      }) => {
        if (timestamp) {
          const monthKey = timestamp.toLocaleString("default", {
            month: "short",
          });
          const monthData = last12Months.find((m) => m.month === monthKey);
          if (monthData) monthData.count++;

          if (timestamp >= twoWeeksAgo) {
            if (failureTypes[predicted_failure_type] !== undefined) {
              failureTypes[predicted_failure_type]++;
            }
            statusCounts[status.toString()]++;
          }
        }
      }
    );

    setMonthlyData(last12Months);
    setFailureTypeData(
      Object.keys(failureTypes).map((key) => ({
        type: key,
        count: failureTypes[key as keyof typeof failureTypes],
      }))
    );
    setStatusData([
      { status: "Fixed Issues", count: statusCounts["true"] },
      { status: "Not Fixed Issues", count: statusCounts["false"] },
    ]);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <NAVBAR />
      <div className="container mx-auto px-6 py-6 bg-sky-100 flex-grow">
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label: "Vibration 1", value: Math.round((parseFloat(sensorValues.vibration_1) + Number.EPSILON) * 100) / 100 },
            { label: "Vibration 2", value: Math.round((parseFloat(sensorValues.vibration_2) + Number.EPSILON) * 100) / 100 },
            { label: "Vibration 3", value: Math.round((parseFloat(sensorValues.vibration_3) + Number.EPSILON) * 100) / 100 },
            { label: "Temperature", value: Math.round((parseFloat(sensorValues.temperature) + Number.EPSILON) * 100) / 100 },
            { label: "RPM", value: Math.round((parseFloat(sensorValues.rpm_1) + Number.EPSILON) * 100) / 100 },
          ].map((sensor, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center"
            >
              <span className="text-lg font-medium">{sensor.label}</span>
              <span className="text-gray-800 mt-2">{sensor.value}</span>
              <span className="text-red-500 mt-2">⛔</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Predictions Stored Per Month 📊
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Failure Types in Last 2 Weeks ⚠️
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={failureTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Fixed vs Not Fixed Issues in Last 2 Weeks ✅❌{" "}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#FF5733" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p>
          © {new Date().getFullYear()} Machine Monitoring System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default SchedulePage;
