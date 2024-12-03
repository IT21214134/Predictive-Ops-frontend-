// import React, { useState } from 'react';

// interface FilterControlsProps {
//   sensors: string[];
//   onToggle: (sensor: string) => void;
// }

// const FilterControls: React.FC<FilterControlsProps> = ({ sensors, onToggle }) => {
//   const [selectedSensors, setSelectedSensors] = useState<string[]>([]);

//   const handleToggle = (sensor: string) => {
//     const updatedSensors = selectedSensors.includes(sensor)
//       ? selectedSensors.filter((s) => s !== sensor)
//       : [...selectedSensors, sensor];

//     setSelectedSensors(updatedSensors);
//     onToggle(sensor);
//   };

//   return (
//     <div className="flex flex-wrap gap-2 p-4">
//       {sensors.map((sensor) => (
//         <button
//           key={sensor}
//           className={`px-4 py-2 border rounded ${
//             selectedSensors.includes(sensor) ? "bg-blue-500 text-white" : "bg-gray-100"
//           }`}
//           onClick={() => handleToggle(sensor)}
//         >
//           {sensor}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default FilterControls;
import React from 'react';

interface FilterControlsProps {
  sensors: string[];
  onToggle: (sensor: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ sensors, onToggle }) => {
  return (
    <div className="flex space-x-4 mb-4 justify-center">
      {sensors.map((sensor) => (
        <button
          key={sensor}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          onClick={() => onToggle(sensor)}
        >
          Toggle {sensor}
        </button>
      ))}
    </div>
  );
};

export default FilterControls;
