import React, { useState } from "react";
import { firestore } from "../../firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalData: any;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  modalData,
}) => {
  const [interruption, setInterruption] = useState(false);
  const [lowSpeed, setLowSpeed] = useState(false);
  const [noise, setNoise] = useState(false);
  const [startupIssue, setStartupIssue] = useState(false);
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");

  const uid = localStorage.getItem("uid");

  const handleSubmit = async () => {
    if (!summary) {
      Swal.fire({
        icon: "error",
        title: "Summary is required",
      });
      return;
    }

    try {
      const docRef = await addDoc(collection(firestore, "feedback"), {
        interruption,
        lowSpeed,
        noise,
        startupIssue,
        description,
        summary,
        uid,
        modalData,
      });
      Swal.fire({
        icon: "success",
        title: "Data saved successfully",
      });

      setInterruption(false);
      setLowSpeed(false);
      setNoise(false);
      setStartupIssue(false);
      setDescription("");
      setSummary("");

      onClose();
    } catch (e) {
      console.error("Error adding document: ", e);
      Swal.fire({
        icon: "error",
        title: "An error occurred. Please try again later.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full space-y-6 animate__animated animate__fadeIn">
        <h2 className="text-3xl font-semibold text-gray-800 text-center">
          User Feedback
        </h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={interruption}
              onChange={() => setInterruption(!interruption)}
              className="h-5 w-5 rounded"
            />
            Interruption
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={lowSpeed}
              onChange={() => setLowSpeed(!lowSpeed)}
              className="h-5 w-5 rounded"
            />
            Low Speed
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={noise}
              onChange={() => setNoise(!noise)}
              className="h-5 w-5 rounded"
            />
            Noise
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={startupIssue}
              onChange={() => setStartupIssue(!startupIssue)}
              className="h-5 w-5 rounded"
            />
            Startup Issue
          </label>
          <textarea
            placeholder="Description"
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <textarea
            placeholder="Summary"
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setSummary(e.target.value)}
          ></textarea>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 transition"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
