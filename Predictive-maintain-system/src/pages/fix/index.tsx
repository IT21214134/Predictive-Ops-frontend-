import React, { useEffect, useState } from "react";
import NAVBAR from "@/components/navBar";
import { useRealTimeData } from "../../components/RealTimeDataContext";
import {
  collection,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../../firebaseconfig";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UserModal from "../../components/model";

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

  const [lastScheduled, setLastScheduled] = useState<any>(null);
  const [filteredSchedules, setFilteredSchedules] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any | null>(null);

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

        const scheduledPredictions = scheduleSnapshot.docs
          .map((doc) => {
            const data = doc.data();
            const scheduleDate = data.schedule_time?.toDate() || new Date();
            const hours = scheduleDate.getHours();

            return {
              id: doc.id,
              formattedTimestamp: data.formattedTimestamp || "Unknown",
              predicted_failure_type: data.predicted_failure_type || "Unknown",
              schedule_time: scheduleDate.toLocaleString(),
              isDay: hours >= 9 && hours < 17,
              status: data.status,
              inputdata: data.inputdata,
            };
          })
          .filter((schedule) => schedule.status === false);

        scheduledPredictions.sort(
          (a, b) =>
            new Date(a.schedule_time).getTime() -
            new Date(b.schedule_time).getTime()
        );

        setLastScheduled(scheduledPredictions);
        setFilteredSchedules(scheduledPredictions);
      } else {
        setLastScheduled([]);
        setFilteredSchedules([]);
      }
    } catch (error) {
      console.error("Error fetching last scheduled predictions:", error);
    }
  };

  useEffect(() => {
    fetchLastScheduled();
  }, []);

  const applyFilter = () => {
    if (startDate && endDate) {
      const filtered = lastScheduled.filter((schedule: any) => {
        const scheduleDate = new Date(schedule.formattedTimestamp);

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        return scheduleDate >= start && scheduleDate <= end;
      });

      setFilteredSchedules(filtered);
    }
    setIsModalOpen(false);
  };

  const handleFix = async (
    scheduleId: string,
    formattedTimestamp: string,
    inputdata: any,
    predicted_failure_type: string
  ) => {
    Swal.fire({
      title: "Fixing in Progress",
      text: "Please wait while prediction are being fixed...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const uid = localStorage.getItem("uid") || "unknown-user";

      const predictionsRef = collection(firestore, `Prediction/`);
      const predictionDocs = await getDocs(predictionsRef);

      for (const predictionDoc of predictionDocs.docs) {
        if (predictionDoc.id === scheduleId) {
          await updateDoc(predictionDoc.ref, { status: true });
        }
      }

      const scheduleRef = collection(firestore, "Schedule");
      const scheduleBatches = await getDocs(scheduleRef);

      let scheduleUpdated = false;
      for (const batchDoc of scheduleBatches.docs) {
        const batchId = batchDoc.id;
        const schedulesRef = collection(
          firestore,
          `Schedule/${batchId}/Schedules`
        );
        const scheduleDocs = await getDocs(schedulesRef);

        for (const scheduleDoc of scheduleDocs.docs) {
          if (scheduleDoc.id === scheduleId) {
            await updateDoc(scheduleDoc.ref, { status: true });
            scheduleUpdated = true;
            setModalData({
              Vibration_01: inputdata.Vibration_01,
              Vibration_02: inputdata.Vibration_02,
              Vibration_03: inputdata.Vibration_03,
              Temperature_01: inputdata.Temperature_01,
              RPM_Sensor_01: inputdata.RPM_Sensor_01,
              Failure_Type: predicted_failure_type,
              id: scheduleDoc.id,
            });
            break;
          }
        }
        if (scheduleUpdated) break;
      }

      const dataToSend = {
        Timestamp: formattedTimestamp,
        Vibration_01: inputdata.Vibration_01,
        Vibration_02: inputdata.Vibration_02,
        Vibration_03: inputdata.Vibration_03,
        Temperature_01: inputdata.Temperature_01,
        RPM_Sensor_01: inputdata.RPM_Sensor_01,
        Failure_Type: predicted_failure_type,
      };

      Swal.fire({
        title: "Success!",
        text: "Fix action applied successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setModalOpen(true);

      fetchLastScheduled();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleIssue = async (
    scheduleId: string,
    formattedTimestamp: string,
    inputdata: any,
    predicted_failure_type: string
  ) => {
    try {
      const { value: selectedIssue } = await Swal.fire({
        title: "Select Issue Type",
        input: "select",
        inputOptions: {
          "Drill Issue": "Drill Issue",
          "Trimmer Bearing Fault": "Trimmer Bearing Fault",
          "No Failure": "No Failure",
        },
        inputPlaceholder: "Select an issue",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        showLoaderOnConfirm: false,
      });
      if (!selectedIssue) {
        return;
      }

      const uid = localStorage.getItem("uid") || "unknown-user";

      const predictionsRef = collection(firestore, `Prediction/`);
      const predictionDocs = await getDocs(predictionsRef);

      for (const predictionDoc of predictionDocs.docs) {
        if (predictionDoc.id === scheduleId) {
          await updateDoc(predictionDoc.ref, { status: true });
        }
      }

      const scheduleRef = collection(firestore, "Schedule");
      const scheduleBatches = await getDocs(scheduleRef);

      let scheduleUpdated = false;
      for (const batchDoc of scheduleBatches.docs) {
        const batchId = batchDoc.id;
        const schedulesRef = collection(
          firestore,
          `Schedule/${batchId}/Schedules`
        );
        const scheduleDocs = await getDocs(schedulesRef);

        for (const scheduleDoc of scheduleDocs.docs) {
          if (scheduleDoc.id === scheduleId) {
            await updateDoc(scheduleDoc.ref, {
              status: true,
              issueType: selectedIssue,
            });
            scheduleUpdated = true;
            setModalData({
              Vibration_01: inputdata.Vibration_01,
              Vibration_02: inputdata.Vibration_02,
              Vibration_03: inputdata.Vibration_03,
              Temperature_01: inputdata.Temperature_01,
              RPM_Sensor_01: inputdata.RPM_Sensor_01,
              Failure_Type: selectedIssue,
              id: scheduleDoc.id,
            });
            break;
          }
        }
        if (scheduleUpdated) break;
      }

      const dataToSend = {
        Timestamp: formattedTimestamp,
        Vibration_01: inputdata.Vibration_01,
        Vibration_02: inputdata.Vibration_02,
        Vibration_03: inputdata.Vibration_03,
        Temperature_01: inputdata.Temperature_01,
        RPM_Sensor_01: inputdata.RPM_Sensor_01,
        Failure_Type: selectedIssue,
      };

      Swal.fire({
        title: "Success!",
        text: `Issue marked as "${selectedIssue}".`,
        icon: "success",
        confirmButtonText: "OK",
      });

      setModalOpen(true);
      fetchLastScheduled();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NAVBAR />

      <div className="container mx-auto px-6 py-4 bg-sky-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
          {[
            { label: "Vibration 1", value: Math.round((parseFloat(sensorValues.vibration_1) + Number.EPSILON) * 100) / 100 },
            { label: "Vibration 2", value: Math.round((parseFloat(sensorValues.vibration_2) + Number.EPSILON) * 100) / 100 },
            { label: "Vibration 3", value: Math.round((parseFloat(sensorValues.vibration_3) + Number.EPSILON) * 100) / 100 },
            { label: "Temperature", value: Math.round((parseFloat(sensorValues.temperature) + Number.EPSILON) * 100) / 100 },
            { label: "RPM", value: Math.round((parseFloat(sensorValues.rpm_1) + Number.EPSILON) * 100) / 100 },
          ].map((sensor, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center border"
            >
              <span className="text-lg font-semibold">{sensor.label}</span>
              <span className="text-gray-800 mt-2 text-xl">{sensor.value}</span>
              <span className="text-red-500 mt-2 text-2xl">⛔</span>
            </div>
          ))}
        </div>

        <div className="container mx-auto px-6 py-4 bg-sky-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <CiFilter
                size={24}
                className="cursor-pointer text-blue-500"
                onClick={() => setIsModalOpen(true)}
              />
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center animate-fadeIn">
                  <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 relative transform scale-100 transition-transform duration-300 ease-in-out">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition duration-200"
                    >
                      ✖
                    </button>

                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                      Filter by Date Range
                    </h2>

                    <div className="flex flex-col gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Start Date
                        </label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          placeholderText="Select Start Date"
                          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          End Date
                        </label>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          placeholderText="Select End Date"
                          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => {
                          setStartDate(null);
                          setEndDate(null);
                          fetchLastScheduled();
                        }}
                        className="px-5 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-md transition duration-200"
                      >
                        Clear
                      </button>

                      <button
                        onClick={applyFilter}
                        className="px-5 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition duration-200"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={fetchLastScheduled}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Refresh
              </button>
            </div>
          </div>

          {filteredSchedules && filteredSchedules.length > 0 ? (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-left">
                    <th className="px-4 py-2 border">Predicted Time</th>
                    <th className="px-4 py-2 border">Failure Type</th>
                    <th className="px-4 py-2 border">Schedule Date & Time</th>
                    <th className="px-4 py-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule: any, index: number) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 border text-gray-700">
                        {schedule.formattedTimestamp}
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
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

                      <td className="px-4 py-2 border text-gray-700 flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            handleFix(
                              schedule.id,
                              schedule.formattedTimestamp,
                              schedule.inputdata,
                              schedule.predicted_failure_type
                            )
                          }
                          className="flex items-center gap-2 text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-700 transition"
                        >
                          Mark as fixed
                        </button>

                        <button
                          onClick={() =>
                            handleIssue(
                              schedule.id,
                              schedule.formattedTimestamp,
                              schedule.inputdata,
                              schedule.predicted_failure_type
                            )
                          }
                          className="flex items-center gap-2 text-white bg-green-500 px-3 py-1 rounded-lg hover:bg-green-700 transition"
                        >
                          Suggest Correction
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <UserModal
                isOpen={modalOpen}
                modalData={modalData}
                onClose={() => setModalOpen(false)}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-lg font-medium">
              No scheduled results yet.
            </p>
          )}
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
