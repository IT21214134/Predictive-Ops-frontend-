// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
// } from 'chart.js';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

// interface GraphProps {
//   label: string;
//   data: number[];
//   timestamps: string[];
// }

// const Graph: React.FC<GraphProps> = ({ label, data, timestamps }) => {
//   const chartData = {
//     labels: timestamps,
//     datasets: [
//       {
//         label,
//         data,
//         borderColor: '#3b82f6',
//         backgroundColor: 'rgba(59, 130, 246, 0.2)',
//         tension: 0.4,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: true,
//       },
//     },
//     scales: {
//       x: {
//         title: { display: true, text: 'Timestamp' },
//       },
//       y: {
//         title: { display: true, text: label },
//       },
//     },
//   };

//   return <Line data={chartData} options={options} />;
// };

// export default Graph;
import React from 'react';
import { Line } from 'react-chartjs-2';

interface GraphProps {
  label: string;
  data: number[];
  timestamps: string[];
}

const Graph: React.FC<GraphProps> = ({ label, data, timestamps }) => {
  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label,
        data,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default Graph;
