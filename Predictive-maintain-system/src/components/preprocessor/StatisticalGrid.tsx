// import React from "react";
// import { FaChartBar, FaTachometerAlt, FaArrowUp, FaArrowDown, FaCalculator } from "react-icons/fa";

// type SensorStats = {
//   sensorName: string;
//   mean: number;
//   median: number;
//   std_dev: number;
//   min: number;
//   max: number;
//   range: number;
// };

// const StatisticalCard = ({ sensorName, mean, median, std_dev, min, max, range }: SensorStats) => {
//   return (
//     <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transform hover:-translate-y-1 transition-all">
//       <h3 className="text-lg font-semibold mb-2 text-gray-800">{sensorName}</h3>
//       <div className="flex flex-col gap-2">
//         <div className="flex justify-between items-center text-sm text-gray-600">
//           <span className="flex items-center gap-2">
//             <FaCalculator className="text-blue-500" />
//             Mean
//           </span>
//           <span className="font-medium">{mean?.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between items-center text-sm text-gray-600">
//           <span className="flex items-center gap-2">
//             <FaTachometerAlt className="text-purple-500" />
//             Median
//           </span>
//           <span className="font-medium">{median?.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between items-center text-sm text-gray-600">
//           <span className="flex items-center gap-2">
//             <FaChartBar className="text-green-500" />
//             Std Dev
//           </span>
//           <span className="font-medium">{std_dev?.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between items-center text-sm text-gray-600">
//           <span className="flex items-center gap-2">
//             <FaArrowDown className="text-red-500" />
//             Min
//           </span>
//           <span className="font-medium">{min?.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between items-center text-sm text-gray-600">
//           <span className="flex items-center gap-2">
//             <FaArrowUp className="text-orange-500" />
//             Max
//           </span>
//           <span className="font-medium">{max?.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between items-center text-sm text-gray-600">
//           <span className="flex items-center gap-2">
//             <FaChartBar className="text-teal-500" />
//             Range
//           </span>
//           <span className="font-medium">{range?.toFixed(2)}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatisticalGrid = ({ sensorStats }: { sensorStats: SensorStats[] }) => {
//     console.log(sensorStats)
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//       {sensorStats.map((stats, index) => (
//         <StatisticalCard key={index} {...stats} />
//       ))}
//     </div>
//   );
// };

// export default StatisticalGrid;


import React from "react";
import { FaChartBar, FaTachometerAlt, FaArrowUp, FaArrowDown, FaCalculator } from "react-icons/fa";

type SensorStats = {
  sensorName: string;
  mean: number;
  median: number;
  std_dev: number;
  min: number;
  max: number;
  range: number;
};

const StatisticalCard = ({ sensorName, mean, median, std_dev, min, max, range }: SensorStats) => {
  return (
    <div className="p-4 bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-xl border border-gray-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-md px-4 py-1 mb-2 shadow-md">{/* <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md px-4 py-1 mb-4 shadow-md"> */}
        <h3 className="text-md font-bold tracking-wide text-center">{sensorName}</h3>
      </div>
      <div className="flex flex-col gap-1">
        {[
          { label: "Mean", value: mean, icon: <FaCalculator />, color: "bg-blue-100 text-blue-500" },
          { label: "Median", value: median, icon: <FaTachometerAlt />, color: "bg-purple-100 text-purple-500" },
          { label: "Std Dev", value: std_dev, icon: <FaChartBar />, color: "bg-green-100 text-green-500" },
          { label: "Min", value: min, icon: <FaArrowDown />, color: "bg-red-100 text-red-500" },
          { label: "Max", value: max, icon: <FaArrowUp />, color: "bg-orange-100 text-orange-500" },
          { label: "Range", value: range, icon: <FaChartBar />, color: "bg-teal-100 text-teal-500" },
        ].map(({ label, value, icon, color }, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${color}`}>{icon}</div>
              <span className="text-gray-700 font-medium">{label}</span>
            </div>
            <span className="text-gray-900 font-bold">{value?.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatisticalGrid = ({ sensorStats }: { sensorStats: SensorStats[] }) => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* First row: 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensorStats.slice(0, 3).map((stats, index) => (
          <StatisticalCard key={index} {...stats} />
        ))}
      </div>

      {/* Second row: 2 centered cards */}
      <div className="ml-28 mr-28 grid grid-cols-2 justify-center gap-4">
        {sensorStats.slice(3, 5).map((stats, index) => (
          <StatisticalCard key={index + 3} {...stats} />
        ))}
      </div>
    </div>
    // <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
    //   {sensorStats.map((stats, index) => (
    //     <StatisticalCard key={index} {...stats} />
    //   ))}
    // </div>
  );
};

export default StatisticalGrid;
