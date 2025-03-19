"use client";
import { useEffect, useState } from "react";

type RecommendationItem = {
  reason: string;
  solution: string;
};
import { useRouter } from "next/navigation";
import axios from "axios";
import React from "react";

export default function Diagnose() {
  const [formData, setFormData] = useState({
    temperature: "",
    vibration: "",
    vibration2: "",
    vibration3: "",
    noise: null,
    alignment: null,
    overheating: null,
    type: null,
  });

  const router = useRouter();
  const [result, setResult] = useState(null);
  const [nextQuestion, setNextQuestion] = useState(null);
  const [recommendation, setRecommendation] = useState<RecommendationItem[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setNextQuestion(null);
    setRecommendation([]);

    try {
      const response = await axios.post(
        "http://localhost:5001/diagnostics/diagnose",
        formData
      );
      setResult(response.data.criticality);
      setNextQuestion(response.data.next_question);
      setRecommendation(response.data.recommendation[0].details);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Something went wrong!");
      } else {
        setError("Something went wrong!");
      }
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("failureData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData({
        temperature: parsedData.temperature || "",
        vibration: parsedData.vibration_01 || "",
        vibration2: parsedData.vibration_02 || "",
        vibration3: parsedData.vibration_03 || "",
        noise: null,
        alignment: null,
        overheating: null,
        type: parsedData.Failure_Type_Name,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-8 text-blue-800 text-center">
          Machine Health Dashboard
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <form
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sensor Readings</h2>
            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={parseFloat(formData.temperature).toFixed(2)}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300"
                  required
                />
                </div>

                <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Vibration 01 Sensor Reading
                </label>
                <input
                  type="number"
                  name="vibration"
                  value={parseFloat(formData.vibration).toFixed(2)}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300"
                  required
                />
                </div>

                <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Vibration 02 Sensor Reading
                </label>
                <input
                  type="number"
                  name="vibration2"
                  value={parseFloat(formData.vibration2).toFixed(2)}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300"
                  required
                />
                </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Vibration 03 Sensor Reading
                </label>
                <input
                  type="number"
                  name="vibration3"
                  value={formData.vibration3}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-3">
                  Noise Detection
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    <input
                      type="radio"
                      name="noise"
                      value="yes"
                      onChange={handleRadioChange}
                      className="w-4 h-4 text-blue-600 mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    <input
                      type="radio"
                      name="noise"
                      value="no"
                      onChange={handleRadioChange}
                      className="w-4 h-4 text-blue-600 mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-3">
                  Alignment Status
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    <input
                      type="radio"
                      name="alignment"
                      value="aligned"
                      onChange={handleRadioChange}
                      className="w-4 h-4 text-blue-600 mr-2"
                    />
                    Aligned
                  </label>
                  <label className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    <input
                      type="radio"
                      name="alignment"
                      value="misaligned"
                      onChange={handleRadioChange}
                      className="w-4 h-4 text-blue-600 mr-2"
                    />
                    Misaligned
                  </label>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-3">
                  Overheating Status
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    <input
                      type="radio"
                      name="overheating"
                      value="yes"
                      onChange={handleRadioChange}
                      className="w-4 h-4 text-blue-600 mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    <input
                      type="radio"
                      name="overheating"
                      value="no"
                      onChange={handleRadioChange}
                      className="w-4 h-4 text-blue-600 mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Run Diagnostic Analysis
            </button>
          </form>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4">Diagnostic Results</h2>
              {result ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-medium text-blue-900">
                  <span className="text-blue-700">Criticality Level:</span>{" "}
                  {typeof result === "object" ? (
                  <pre className="mt-2 p-3 bg-blue-100 rounded overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                  ) : (
                  result
                  )}
                </p>
                </div>

                {nextQuestion && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="font-medium text-yellow-900">
                  <span className="text-yellow-700">Follow-up Analysis:</span>{" "}
                  {typeof nextQuestion === "object" ? (
                    <pre className="mt-2 p-3 bg-yellow-100 rounded overflow-x-auto">
                    {JSON.stringify(nextQuestion, null, 2)}
                    </pre>
                  ) : (
                    nextQuestion
                  )}
                  </p>
                </div>
                )}

                {recommendation && Array.isArray(recommendation) && (
                <div className="bg-green-50 p-6 rounded-lg space-y-4">
                  <h3 className="font-semibold text-xl text-green-800">Recommended Actions</h3>
                  <ul className="space-y-4">
                  {recommendation.map((item: RecommendationItem, index: number) => (
                    <li key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                    <p className="font-medium text-gray-800 mb-2">
                      <span className="text-green-700">Issue:</span> {item.reason}
                    </p>
                    <p className="text-gray-700">
                      <span className="text-green-700">Solution:</span> {item.solution}
                    </p>
                    </li>
                  ))}
                  </ul>
                </div>
                )}
              </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-600">No diagnostic results available. Please run the analysis to see results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
