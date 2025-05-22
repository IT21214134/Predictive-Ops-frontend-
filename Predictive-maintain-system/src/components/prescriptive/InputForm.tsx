"use client";

import { useState } from "react";

type InputFormProps = {
  onPredict: (predictedValue: string) => void;
};

export default function InputForm({ onPredict }: InputFormProps) {
  const [inputs, setInputs] = useState({
    temperature: "",
    vibration_1: "",
    vibration_2: "",
    vibration_3: "",
    rotationalSpeed: "",
    torque: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate prediction logic
    onPredict("Predicted Value");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-8 rounded shadow-md max-w-lg mx-auto space-y-4"
    >
      <h2 className="text-2xl font-semibold mb-4">Input Data for Prediction</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          "temperature",
          "vibration_1",
          "vibration_2",
          "vibration_3",
          "rotationalSpeed",
        ].map((field) => (
          <input
            key={field}
            name={field}
            value={(inputs as any)[field]}
            onChange={handleChange}
            type="number"
            placeholder={field
              .split(/(?=[A-Z])/)
              .join(" ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
            className="p-2 border rounded w-full text-center"
          />
        ))}
      </div>
      <button
        type="submit"
        className="bg-black text-white py-2 px-4 rounded w-full mt-4"
      >
        Submit Data for Prediction
      </button>
    </form>
  );
}
