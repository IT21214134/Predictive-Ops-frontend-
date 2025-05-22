import React, { useEffect, useState } from "react";
import { useRealTimeData } from "../../components/RealTimeDataContext";
import NAVBAR from "@/components/navBar";
import { firestore, database } from "../../../firebaseconfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  where,
  getDocs,
  query,
} from "firebase/firestore";
import { ref, set } from "firebase/database";
import axios from "axios";

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
  const [uid, setUserId] = useState("");
  const [userData, setUserData] = useState<{
    email: string;
    phone: string;
  } | null>(null);

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

  const fetchUserData = async (uid: string) => {
    try {
      const usersRef = collection(firestore, "user");
      const q = query(usersRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        if (userData.email && userData.phone) {
          setUserData({
            email: userData.email,
            phone: userData.phone,
          });
        } else {
          console.error("User data missing email or phone");
        }
      } else {
        console.error("No user found with UID:", uid);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("uid");
    console.log("Stored UID from localStorage:", storedUserId);
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserData(storedUserId);
    } else {
      console.error("No UID found in localStorage");
    }
  }, []);


  const handlePredict = async (data: typeof sensorValues) => {
    const payload = {
      Vibration_01: data.vibration_1,
      Vibration_02: data.vibration_2,
      Vibration_03: data.vibration_3,
      Temperature_01: data.temperature,
      RPM_Sensor_01: data.rpm_1,
    };

    try {
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

      const failureType = result.predicted_failure_type;
      let realtimeData = {
        flash_light: {
          drill_issue: false,
          no_failure: false,
          trimmer_bearing: false
        }
      };

      if (failureType === "No Failure") {
        realtimeData.flash_light.no_failure = true;
      } else if (failureType === "Trimmer Bearing Fault") {
        realtimeData.flash_light.trimmer_bearing = true;
      } else if (failureType === "Drill Issue") {
        realtimeData.flash_light.drill_issue = true;
      }

      await set(ref(database), realtimeData);

      await addDoc(collection(firestore, "Prediction"), {
        input_data: payload,
        prediction_result: result,
        timestamp: serverTimestamp(),
        status: "false",
      });
      console.log("Prediction stored successfully!", result.predicted_failure_type);

      if (result.predicted_failure_type !== "No Failure" && userData?.email) {
        try {
          await axios.post("https://email-1086792422178.us-central1.run.app", {
            email: [userData.email],
            prediction_result: result.predicted_failure_type,
          });

          if (userData?.phone) {
            const apiUrl = "192.168.1.4:8082";
            const apiKey = "496c86aa-3f00-48d2-806c-3dff690ad8aa";

            const message =
              result.predicted_failure_type === "Trimmer Bearing Fault"
                ? 'Dear Team,\n\nCritical Issue Detected: Trimmer Bearing Fault\n\nBest Regards,\n\nMaintenance Team'
                : 'Dear Team,\n\nAlert: Drill Issue Detected\n\nBest Regards,\n\nMaintenance Team';

            const requestBody = {
              to: `+94${userData.phone.substring(1)}`,
              message: message,
            };
            console.log(requestBody);

            console.log("Sending notifications to:", userData.email, userData.phone);
            

            await axios.post(`//${apiUrl}`, requestBody, {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: apiKey,
              },
            });
          }
        } catch (error) {
          console.error("Error sending notifications:", error);
        }
      }

      console.log("Prediction stored and notifications sent successfully!");
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
                    <span className="text-blue-500 text-lg">✔</span>
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
            Predicted Result
          </h2>
          <div className="flex items-center justify-center">
            {predictionResult && (
              <span
                className={`text-white text-lg font-semibold px-4 py-2 rounded-lg shadow-md ${
                  predictionResult === "No Failure"
                    ? "bg-green-700"
                    : predictionResult === "Trimmer Bearing Fault"
                    ? "bg-red-700"
                    : predictionResult === "Drill Issue"
                    ? "bg-yellow-700"
                    : "bg-gray-700"
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