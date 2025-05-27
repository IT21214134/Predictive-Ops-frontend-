import React from "react";
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

type SensorStatusProps = {
    name: string;
    value: number;
    processedValue: number;
    nullFlag: number;
    anomalyFlag: string;
};

const SensorStatus = ({ name, value, processedValue, nullFlag, anomalyFlag }: SensorStatusProps) => {
    const isNull = nullFlag === 1;
    const isAnomalous = anomalyFlag !== "Normal";

    return (
        <div className="relative p-6 border rounded-lg shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Title */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 underline underline-offset-8">{name}</h3>
                <FaInfoCircle className="text-gray-500 hover:text-gray-800 transition duration-150 cursor-pointer" title="View details" />
            </div>

            {/* Value */}
            <div
                className={`mt-4 text-lg font-semibold ${
                    isNull
                        ? "text-red-500"
                        : isAnomalous
                        ? "text-yellow-500"
                        : "text-blue-500"
                }`}
            >
                {isNull
                    ? `Processed to an average value: ${processedValue?.toFixed(2)}`
                    : isAnomalous
                    ? `Processed to an acceptable range value: ${processedValue?.toFixed(2)}`
                    : `Original value: ${value.toFixed(2)}`}
            </div>
            <div /*className="text-center items-center"*/>{name?.startsWith("Vibration") ? "(vibration magnitude - m/s²)" : name?.startsWith("Temperature") ? "(°C)" : "-"}</div>

            {/* Status Indicators */}
            <div className="mt-4">
                {isNull && (
                    <div className="flex items-center gap-2 text-red-500 animate-bounce">
                        <FaTimesCircle className="text-2xl" />
                        <span className="font-medium">Null Detected</span>
                    </div>
                )}
                {isAnomalous && (
                    <div className="flex items-center gap-2 text-yellow-500 animate-pulse">
                        <FaExclamationTriangle className="text-2xl" />
                        <span className="font-medium">Anomaly Detected</span>
                    </div>
                )}
                {!isNull && !isAnomalous && (
                    <div className="flex items-center gap-2 text-green-500">
                        <FaCheckCircle className="text-2xl" />
                        <span className="font-medium">Normal</span>
                    </div>
                )}
            </div>

            {/* Decorative Elements */}
            <div
                className={`absolute -top-3 -right-3 w-7 h-7 rounded-full ${
                    isNull
                        ? "bg-red-500/20"
                        : isAnomalous
                        ? "bg-yellow-500/20"
                        : "bg-green-500/20"
                } animate-ping`}
            ></div>
        </div>
    );
};

export default SensorStatus;
