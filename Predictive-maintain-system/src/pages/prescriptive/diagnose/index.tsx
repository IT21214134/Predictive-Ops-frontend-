"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Diagnose() {
  const [formData, setFormData] = useState({
    temperature: "",
    vibration: "",
    vibration2: "",
    vibration3: "",
    noise: null,
    alignment: null,
    overheating: null,
  });

  const router = useRouter();
  const [result, setResult] = useState(null);
  const [nextQuestion, setNextQuestion] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
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
    setRecommendation(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/diagnose",
        formData
      );
      setResult(response.data.cause);
      setNextQuestion(response.data.next_question);
      setRecommendation(response.data.recommendation);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Diagnostic Tool</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="temperature"
              className="block text-sm font-medium text-gray-700"
            >
              Temperature (°C)
            </label>
            <input
              type="number"
              name="temperature"
              id="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="vibration"
              className="block text-sm font-medium text-gray-700"
            >
              Vibration Level 1 (mm/s)
            </label>
            <input
              type="number"
              name="vibration"
              id="vibration"
              value={formData.vibration}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="vibration2"
              className="block text-sm font-medium text-gray-700"
            >
              Vibration Level 2 (mm/s)
            </label>
            <input
              type="number"
              name="vibration2"
              id="vibration2"
              value={formData.vibration2}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="vibration3"
              className="block text-sm font-medium text-gray-700"
            >
              Vibration Level 3 (mm/s)
            </label>
            <input
              type="number"
              name="vibration3"
              id="vibration3"
              value={formData.vibration3}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <fieldset>
              <legend className="text-sm font-medium text-gray-700">
                Abnormal Noise
              </legend>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="noise"
                    value="1"
                    onChange={handleRadioChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="noise"
                    value="0"
                    onChange={handleRadioChange}
                    className="form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </fieldset>
          </div>

          <div>
            <fieldset>
              <legend className="text-sm font-medium text-gray-700">
                Misalignment
              </legend>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="alignment"
                    value="1"
                    onChange={handleRadioChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="alignment"
                    value="0"
                    onChange={handleRadioChange}
                    className="form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </fieldset>
          </div>

          <div>
            <fieldset>
              <legend className="text-sm font-medium text-gray-700">
                Overheating Signs
              </legend>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="overheating"
                    value="1"
                    onChange={handleRadioChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="overheating"
                    value="0"
                    onChange={handleRadioChange}
                    className="form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </fieldset>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Diagnose
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-100 rounded-md">
              <h3 className="text-lg font-medium text-green-800">Diagnosis</h3>
              <p className="mt-2 text-green-700">{result}</p>
            </div>

            {nextQuestion && (
              <div className="p-4 bg-blue-100 rounded-md">
                <h3 className="text-lg font-medium text-blue-800">
                  Additional Information Needed
                </h3>
                <p className="mt-2 text-blue-700">{nextQuestion}</p>
              </div>
            )}

            {recommendation && (
              <div className="p-4 bg-yellow-100 rounded-md">
                <h3 className="text-lg font-medium text-yellow-800">
                  Recommended Action
                </h3>
                <p className="mt-2 text-yellow-700">{recommendation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
