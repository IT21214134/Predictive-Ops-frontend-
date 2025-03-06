import React, { useEffect, useState } from "react";
import { useRealTimeData } from "../../components/RealTimeDataContext";
import NAVBAR from "@/components/navBar";
import { firestore } from "../../../firebaseconfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function PredictPage() {
  const { data: realTimeData } = useRealTimeData();
  const [sensorValues, setSensorValues] = useState({
    vibration_1: "",
    vibration_2: "",
    vibration_3: "",
    temperature: "",
    rpm_1: "",
  });

  const [predictionResult, setPredictionResult] = useState<string | null>(null);

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
      handlePredict(updatedValues);
    }
  }, [realTimeData]);

  const handlePredict = async (data: typeof sensorValues) => {
    const payload = {
      Vibration_01: data.vibration_1,
      Vibration_02: data.vibration_2,
      Vibration_03: data.vibration_3,
      Temperature_01: data.temperature,
      RPM_Sensor_01: data.rpm_1,
    };

    try {
      const uid = localStorage.getItem("uid") || "unknown-user";

      const response = await fetch(
        "https://us-central1-stellar-verve-446507-j7.cloudfunctions.net/predictionType",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      setPredictionResult(result.predicted_failure_type);

      await addDoc(collection(firestore, `Prediction/`), {
        input_data: payload,
        prediction_result: result,
        timestamp: serverTimestamp(),
        status: "false",
      });

      console.log("Prediction stored successfully!");
    } catch (error) {
      console.error("Error predicting failure:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NAVBAR />
      <div className="container mx-auto px-6 py-4 bg-sky-100">
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label: "Vibration 1", value: sensorValues.vibration_1 },
            { label: "Vibration 2", value: sensorValues.vibration_2 },
            { label: "Vibration 3", value: sensorValues.vibration_3 },
            { label: "Temperature", value: sensorValues.temperature },
            { label: "RPM", value: sensorValues.rpm_1 },
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

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
            Sensor Data
          </h2>
          <form className="grid grid-cols-1 gap-4">
            {(Object.keys(sensorValues) as (keyof typeof sensorValues)[]).map(
              (field, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    {field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </label>
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-lg bg-gray-100 px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <input
                      type="text"
                      value={sensorValues[field]}
                      readOnly
                      className="w-full bg-transparent outline-none text-gray-800"
                    />
                    <span className="text-blue-500 text-lg">✔️</span>
                  </div>
                </div>
              )
            )}
            <button
              type="button"
              onClick={() => handlePredict(sensorValues)}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Predict Failures
            </button>
          </form>
        </div>

        <div className="mt-8 bg-gradient-to-br from-blue-100 to-blue-300 shadow-lg rounded-xl p-6 border border-black">
          <h2 className="text-2xl font-bold text-black-700 mb-4 text-center">
            AI Verified Result
          </h2>
          <div className="flex items-center justify-center">
            {predictionResult && (
              <span
                className={`text-white text-lg font-semibold px-4 py-2 rounded-lg shadow-md ${
                  predictionResult === "No Failure"
                    ? "bg-green-700"
                    : "bg-red-700"
                }`}
              >
                {predictionResult}
              </span>
            )}
          </div>
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

export default PredictPage;
