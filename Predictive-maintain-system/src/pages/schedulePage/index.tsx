import React, { useEffect, useState } from "react";
import NAVBAR from "@/components/navBar";
import { useRealTimeData } from "../../components/RealTimeDataContext";
import {
  collection,
  getDocs,
  getFirestore,
  Timestamp,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { app } from "../../../firebaseconfig";
import Swal from "sweetalert2";

const firestore = getFirestore(app);

function SchedulePage() {
  const { data: realTimeData } = useRealTimeData();
  const [sensorValues, setSensorValues] = useState({
    vibration_1: "",
    vibration_2: "",
    vibration_3: "",
    temperature: "",
    rpm_1: "",
  });

  interface Prediction {
    id: string;
    predicted_target: string;
    predicted_failure_type: string;
    status: boolean;
    inputdata: any;
    timestamp: Date | null;
    formattedTimestamp: string;
  }

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [prioritizedPredictions, setPrioritizedPredictions] = useState<
    Prediction[]
  >([]);
  const [lastScheduled, setLastScheduled] = useState<any>(null);

  useEffect(() => {
    if (realTimeData) {
      setSensorValues({
        vibration_1: realTimeData.vibration_1?.toString() || "",
        vibration_2: realTimeData.vibration_2?.toString() || "",
        vibration_3: realTimeData.vibration_3?.toString() || "",
        temperature: realTimeData.temperature?.toString() || "",
        rpm_1: realTimeData.rpm_1?.toString() || "",
      });
    }
  }, [realTimeData]);

  useEffect(() => {
    const fetchPredictions = async () => {
      const uid = localStorage.getItem("uid");
      const predictionsRef = collection(firestore, `Prediction/`);

      const snapshot = await getDocs(predictionsRef);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const fetchedPredictions = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          const timestamp =
            data.timestamp instanceof Timestamp
              ? data.timestamp.toDate()
              : null;
          return {
            id: doc.id,
            predicted_target: data.prediction_result.predicted_target,
            predicted_failure_type:
              data.prediction_result.predicted_failure_type,
            status: data.status === false,
            timestamp: timestamp,
            inputdata: data.input_data,
            formattedTimestamp: timestamp
              ? timestamp.toLocaleString()
              : "Unknown",
          };
        })
        .filter(
          (prediction) =>
            prediction.status === false &&
            prediction.predicted_failure_type !== "No Failure" &&
            prediction.timestamp &&
            prediction.timestamp >= oneWeekAgo
        );

      setPredictions(fetchedPredictions);
    };

    fetchPredictions();
  }, []);

  const prioritizePredictions = () => {
    const sortedPredictions = [...predictions].sort((a, b) => {
      if (
        a.predicted_failure_type === "Trimmer Bearing Fault" &&
        b.predicted_failure_type !== "Trimmer Bearing Fault"
      ) {
        return -1;
      }
      if (
        b.predicted_failure_type === "Trimmer Bearing Fault" &&
        a.predicted_failure_type !== "Trimmer Bearing Fault"
      ) {
        return 1;
      }
      return (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0);
    });

    setPrioritizedPredictions(sortedPredictions);
  };

  const schedulePredictions = async () => {
    if (prioritizedPredictions.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Predictions!",
        text: "No prioritized predictions to schedule.",
      });
      return;
    }

    Swal.fire({
      title: "Scheduling in Progress",
      text: "Please wait while predictions are being scheduled...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const scheduleBatchRef = collection(firestore, "Schedule");
    const batchDocRef = await addDoc(scheduleBatchRef, {
      created_at: serverTimestamp(),
    });

    const scheduleRef = collection(
      firestore,
      `Schedule/${batchDocRef.id}/Schedules`
    );

    let currentTime = new Date();
    const workingStart = 9;
    const workingEnd = 17;
    let successCount = 0;

    try {
      for (const prediction of prioritizedPredictions) {
        let addHours =
          prediction.predicted_failure_type === "Trimmer Bearing Fault" ? 6 : 4;

        let startTime = new Date(currentTime);

        let endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + addHours);

        if (endTime.getHours() >= workingEnd) {
          endTime.setDate(endTime.getDate() + 1);
          endTime.setHours(workingStart + (endTime.getHours() - workingEnd));
        }

        const dateRange = `${startTime.toLocaleString()} - ${endTime.toLocaleString()}`;

        const scheduleData = {
          id: prediction.id,
          inputdata: prediction.inputdata,
          formattedTimestamp: prediction.formattedTimestamp,
          status: false,
          schedule_time: Timestamp.fromDate(startTime),
          end_time: Timestamp.fromDate(endTime),
          date_range: dateRange,
          created_at: serverTimestamp(),
          predicted_failure_type: prediction.predicted_failure_type,
        };

        await setDoc(doc(scheduleRef, prediction.id), scheduleData);
        successCount++;

        currentTime = new Date(endTime);
      }

      Swal.fire({
        icon: "success",
        title: "Scheduling Completed!",
        text: `${successCount} predictions have been scheduled successfully.`,
      });

      fetchLastScheduled();
    } catch (error) {
      console.error("Error scheduling predictions:", error);
      Swal.fire({
        icon: "error",
        title: "Scheduling Failed!",
        text: "An error occurred while scheduling predictions.",
      });
    }
  };

  useEffect(() => {
    fetchLastScheduled();
  }, []);

  const fetchLastScheduled = async () => {
    try {
      const scheduleRef = collection(firestore, "Schedule");

      const snapshot = await getDocs(scheduleRef);
      const sortedBatches = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          created_at: doc.data().created_at?.toDate() || new Date(0),
        }))
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

      if (sortedBatches.length > 0) {
        const latestBatch = sortedBatches[0];

        const schedulesRef = collection(
          firestore,
          `Schedule/${latestBatch.id}/Schedules`
        );
        const scheduleSnapshot = await getDocs(schedulesRef);

        const scheduledPredictions = scheduleSnapshot.docs.map((doc) => {
          const data = doc.data();
          const scheduleDate = data.schedule_time?.toDate() || new Date();
          const hours = scheduleDate.getHours();

          return {
            id: doc.id,
            formattedTimestamp: data.formattedTimestamp || "Unknown",
            predicted_failure_type: data.predicted_failure_type || "Unknown",
            schedule_time: scheduleDate.toLocaleString(),
            isDay: hours >= 9 && hours < 17,
          };
        });

        scheduledPredictions.sort(
          (a, b) =>
            new Date(a.schedule_time).getTime() -
            new Date(b.schedule_time).getTime()
        );

        setLastScheduled(scheduledPredictions);
      } else {
        setLastScheduled([]);
      }
    } catch (error) {
      console.error("Error fetching last scheduled predictions:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NAVBAR />

      <div className="container mx-auto px-6 py-4 bg-sky-100">
        <div className="grid grid-cols-5 gap-4 mt-6 mx-6">
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
          <div className="bg-white shadow-lg rounded-xl p-6 mb-6 mt-6 mx-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Automatically prioritize the maintenance schedules weekly based on
              the severity.
            </h2>
            {predictions.length > 0 ? (
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {predictions.map((prediction, index) => (
                  <li key={index} className="text-lg font-medium">
                    <span className="font-semibold text-blue-600">
                      {prediction.formattedTimestamp}
                    </span>
                    :
                    <span className="ml-2 text-gray-900">
                      {prediction.predicted_failure_type}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-lg font-medium">
                No predictions available.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <button
                onClick={prioritizePredictions}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-md hover:bg-blue-700 transition duration-300 w-full"
              >
                Start Prioritizing Process
              </button>

              <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Prioritizing Result:
                </h3>
                {prioritizedPredictions.length > 0 ? (
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    {prioritizedPredictions.map((prediction, index) => (
                      <li key={index} className="text-lg font-medium">
                        <span className="font-semibold text-red-600">
                          {prediction.formattedTimestamp}
                        </span>
                        :
                        <span className="ml-2 text-gray-900">
                          {prediction.predicted_failure_type}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-lg font-medium">
                    No prioritized results yet.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={schedulePredictions}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-md hover:bg-blue-700 transition duration-300 w-full"
              >
                Schedule
              </button>

              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Scheduled Result:
                </h3>

                {lastScheduled && lastScheduled.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left">
                          <th className="px-4 py-2 border">Predicted Time</th>
                          <th className="px-4 py-2 border">Failure Type</th>
                          <th className="px-4 py-2 border">
                            Schedule Date & Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {lastScheduled.map((schedule: any, index: any) => (
                          <tr key={index} className="text-gray-900 border-t">
                            <td className="px-4 py-2 border">
                              {schedule.formattedTimestamp}
                            </td>
                            <td className="px-4 py-2 border">
                              {schedule.predicted_failure_type}
                            </td>
                            <td className="px-4 py-2 border">
                              {new Date(schedule.schedule_time).toLocaleString(
                                "en-US",
                                {
                                  month: "numeric",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                }
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-lg font-medium">
                    No scheduled results yet.
                  </p>
                )}
              </div>
            </div>
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

export default SchedulePage;