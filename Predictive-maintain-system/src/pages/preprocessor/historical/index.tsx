// // components/AnomalyDataViewer.tsx
// import { useState, useEffect } from 'react';
// import { db } from '@/config/firebase'; // Firebase configuration
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { DateRangePicker } from 'react-date-range';
// import { addDays } from 'date-fns';
// import 'react-date-range/dist/styles.css'; // Import styles
// import 'react-date-range/dist/theme/default.css'; // Import styles
// import { format } from 'date-fns';

// const AnomalyDataViewer = () => {
//   const [anomalies, setAnomalies] = useState<any[]>([]);
//   const [dateRange, setDateRange] = useState<any>({
//     startDate: addDays(new Date(), -7), // Default: 7 days ago
//     endDate: new Date(),
//     key: 'selection',
//   });
//   const [loading, setLoading] = useState<boolean>(false);

//   // Function to format date to match Firestore timestamps
//   const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

//   const fetchAnomalyData = async () => {
//     setLoading(true);
//     try {
//       const anomaliesQuery = query(
//         collection(db, 'anomalies'),
//         where('timestamp', '>=', formatDate(dateRange.startDate)),
//         where('timestamp', '<=', formatDate(dateRange.endDate))
//       );

//       const querySnapshot = await getDocs(anomaliesQuery);
//       const anomalyData: any[] = [];
//       querySnapshot.forEach((doc) => {
//         anomalyData.push(doc.data());
//       });

//       setAnomalies(anomalyData);
//     } catch (error) {
//       console.error('Error fetching anomalies:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnomalyData();
//   }, [dateRange]);

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-3xl font-semibold mb-4 text-center">Anomaly Data Viewer</h1>

//       <div className="flex justify-center mb-6">
//         <DateRangePicker
//           ranges={[dateRange]}
//           onChange={(ranges) => setDateRange(ranges.selection)}
//           moveRangeOnFirstSelection={false}
//           months={2}
//           direction="horizontal"
//         />
//       </div>

//       <div className="mb-4 flex justify-center">
//         <button
//           onClick={fetchAnomalyData}
//           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//         >
//           Fetch Anomalies
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center">
//           <span className="text-lg text-gray-500">Loading...</span>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           {anomalies.length > 0 ? (
//             <table className="min-w-full bg-white border border-gray-300">
//               <thead>
//                 <tr className="border-b">
//                   <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Timestamp</th>
//                   <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Anomalies</th>
//                   <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Sensor Data</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {anomalies.map((anomaly, index) => (
//                   <tr key={index} className="border-b">
//                     <td className="px-6 py-3 text-sm text-gray-700">
//                       {format(new Date(anomaly.timestamp), 'yyyy-MM-dd HH:mm:ss')}
//                     </td>
//                     <td className="px-6 py-3 text-sm text-gray-700">
//                       {anomaly.anomalies.join(', ') || 'No Anomalies'}
//                     </td>
//                     <td className="px-6 py-3 text-sm text-gray-700">
//                       <pre>{JSON.stringify(anomaly.sensorData, null, 2)}</pre>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="flex justify-center text-lg text-gray-500">No anomalies found for the selected range.</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AnomalyDataViewer;





// - Stable ********************

// import React, { useState } from "react";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "@/config/firebase";
// import { format } from "date-fns";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// const AnomalyViewer: React.FC = () => {
//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");
//   const [anomalies, setAnomalies] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchAnomalies = async () => {
//     if (!startDate || !endDate) {
//       alert("Please select both start and end dates.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const anomaliesRef = collection(db, "anomalies");
//       const q = query(
//         anomaliesRef,
//         where("timestamp", ">=", startDate),
//         where("timestamp", "<=", endDate)
//       );

//       const querySnapshot = await getDocs(q);
//       const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setAnomalies(data);
//     } catch (error) {
//       console.error("Error fetching anomalies:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const processChartData = () => {
//     return anomalies.map((anomaly) => ({
//       timestamp: format(new Date(anomaly.timestamp), "HH:mm:ss"),
//       anomalies: anomaly.anomalies?.length,
//       nulls: anomaly.nulls?.length,
//     }));
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Historical Anomaly Viewer</h1>

//       <div className="flex flex-col md:flex-row gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Start Date</label>
//           <input
//             type="date"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">End Date</label>
//           <input
//             type="date"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//         </div>

//         <button
//           className="self-end px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           onClick={fetchAnomalies}
//         >
//           Fetch Anomalies
//         </button>
//       </div>

//       {loading && <p className="mt-4 text-gray-600">Loading...</p>}

//       {anomalies.length > 0 && (
//         <div className="mt-6">
//           {/* Data Summary */}
//           <div className="bg-white p-4 shadow rounded-md mb-6">
//             <h2 className="text-lg font-bold text-gray-700 mb-4">Data Analysis</h2>
//             <p className="text-sm text-gray-600">
//               Total Records: <span className="font-bold">{anomalies.length}</span>
//             </p>
//             <p className="text-sm text-gray-600">
//               Total Anomalies:{" "}
//               <span className="font-bold">
//                 {anomalies.reduce((sum, a) => sum + a.anomalies?.length, 0)}
//               </span>
//             </p>
//             <p className="text-sm text-gray-600">
//               Total Null Flags:{" "}
//               <span className="font-bold">
//                 {anomalies.reduce((sum, a) => sum + a.nulls?.length, 0)}
//               </span>
//             </p>
//           </div>

//           {/* Chart */}
//           <div className="bg-white p-4 shadow rounded-md mb-6">
//             <h2 className="text-lg font-bold text-gray-700 mb-4">Visualization</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={processChartData()} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
//                 <XAxis dataKey="timestamp" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="anomalies" fill="#8884d8" name="Anomalies" />
//                 <Bar dataKey="nulls" fill="#82ca9d" name="Null Flags" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Data Table */}
//           <div className="bg-white p-4 shadow rounded-md">
//             <h2 className="text-lg font-bold text-gray-700 mb-4">Detailed Data</h2>
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Timestamp
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Anomalies
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Null Flags
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Details
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {anomalies.map((anomaly) => (
//                   <tr key={anomaly.id}>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {format(new Date(anomaly.timestamp), "yyyy-MM-dd HH:mm:ss")}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900">
//                       {anomaly.anomalies?.length}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900">
//                       {anomaly.nulls?.length}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-indigo-600 cursor-pointer">
//                       <details>
//                         <summary className="text-sm font-medium">View Details</summary>
//                         <pre className="text-xs text-gray-600 mt-2">
//                           {JSON.stringify(anomaly?.sensorData, null, 2)}
//                         </pre>
//                       </details>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {anomalies.length === 0 && !loading && (
//         <p className="text-gray-600 mt-4">No anomalies found for the selected period.</p>
//       )}
//     </div>
//   );
// };

// export default AnomalyViewer;

import React, { useRef, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore as db } from "../../../../firebaseconfig";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
//import html2canvas from "html2canvas";
import NAVBAR from "@/components/navBar";

const AnomalyViewer: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null); // container for screenshot

  const fetchAnomalies = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);

    try {
      const anomaliesRef = collection(db, "anomalies");
      const q = query(
        anomaliesRef,
        where("timestamp", ">=", startDate),
        where("timestamp", "<=", endDate)
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAnomalies(data);
    } catch (error) {
      console.error("Error fetching anomalies:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------- pdf logic ------------------------------- */
  const generatePdfReport = async () => {
    if (!anomalies.length) return alert("No data - fetch anomalies first.");

    try {
      const { default: Chart } = await import("chart.js/auto");
      const labels = anomalies.map((a) => format(new Date(a.timestamp), "dd/MM HH:mm"));
      const anomalyCounts = anomalies.map((a) => a.anomalies?.length ?? 0);
      const nullCounts = anomalies.map((a) => a.nulls?.length ?? 0);


      // Sensor-level analysis
      const sensorAnomalyCount: Record<string, number> = {};
      const sensorNullCount: Record<string, number> = {};

      anomalies.forEach((entry) => {
        (entry.anomalies ?? []).forEach((sensor: string) => {
          sensorAnomalyCount[sensor] = (sensorAnomalyCount[sensor] || 0) + 1;
        });
        (entry.nulls ?? []).forEach((sensor: string) => {
          sensorNullCount[sensor] = (sensorNullCount[sensor] || 0) + 1;
        });
      });

      const sortedAnomalousSensors = Object.entries(sensorAnomalyCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5

      const sortedNullSensors = Object.entries(sensorNullCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);


      /* -------------------- build off‑screen Chart.js canvas --------------- */
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      const chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            { label: "Anomalies", data: anomalyCounts, backgroundColor: "#4f46e5" },
            { label: "Null Flags", data: nullCounts, backgroundColor: "#16a34a" },
          ],
        },
        options: {
          responsive: false,
          animation: false, // Disable animations for better PDF generation
          plugins: { 
            legend: { 
              position: "top", 
              labels: { font: { size: 28 } } 
            } 
          },
          scales: {
            x: { 
              ticks: { font: { size: 24 }, maxRotation: 45, minRotation: 45 }, 
              grid: { display: false } 
            },
            y: { 
              ticks: { font: { size: 24 } } 
            },
          },
        },
      });

      // Wait for chart to render completely
      await new Promise(resolve => {
        Chart.defaults.animation = false; // Ensure no animations
        setTimeout(() => {
          resolve(null);
        }, 500); // Give it time to render
      });

      // Get the chart image with higher quality
      const chartImg = canvas.toDataURL("image/png", 1.0);
      
      // Verify the image was created
      if (!chartImg || chartImg === "data:,") {
        throw new Error("Failed to generate chart image");
      }

      chart.destroy();

      /* ------------------------- analytics & summary ----------------------- */
      const totalAnomalies = anomalyCounts.reduce((a, b) => a + b, 0);
      const totalNulls = nullCounts.reduce((a, b) => a + b, 0);
      const maxAnom = Math.max(...anomalyCounts);
      const idxMax = anomalyCounts.indexOf(maxAnom);
      const worstTs = maxAnom !== 0 && labels[idxMax] ? labels[idxMax] : "-";
      const anomalyPct = ((totalAnomalies / (totalAnomalies + totalNulls)) * 100 || 0).toFixed(1);
      const nullPct = ((totalNulls / (totalAnomalies + totalNulls)) * 100 || 0).toFixed(1);

      /* -------------------------- assemble PDF ---------------------------- */
      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pw = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Anomaly Report", pw / 2, 40, { align: "center" });
      doc.setFont("helvetica", "normal"); // Reset to normal font
      doc.setFontSize(12);
      doc.text(`Period: ${format(new Date(startDate), "yyyy-MM-dd")} - ${format(new Date(endDate), "yyyy-MM-dd")}`, 40, 70);
      doc.text(`Generated: ${format(new Date(), "yyyy-MM-dd HH:mm")}`, 40, 90);

      // Summary block
      doc.setFontSize(14);
      doc.text("Key Metrics", pw / 2, 120, { align: "center" });
      doc.setFontSize(11);
      const summaryLines = [
        [`Total records`, anomalies.length.toString()],
        [`Total null flags`, totalNulls.toString()],
        [`Total anomalies`, totalAnomalies.toString()],
        [`Null flags %`, `${nullPct}%`],
        [`Anomaly %`, `${anomalyPct}%`],
        [`Worst timestamp`, worstTs],
      ];

      const tableWidth = 300;
      const tableStartX = (pw - tableWidth) / 2; // Center the table
      
      autoTable(doc, {
        startY: 130,
        head: [["Metric", "Value"]],
        body: summaryLines,
        theme: "grid",
        styles: { fontSize: 10 },
        margin: { left: tableStartX, right: tableStartX },
        tableWidth: tableWidth,
      });

      // // Chart image - with better positioning and error handling
      // const chartTop = (doc as any).lastAutoTable ? ((doc as any).lastAutoTable.finalY || 0) + 20 : 200;
      // const chartW = pw - 340; // leave space for summary block
      // const chartH = (canvas.height * chartW) / canvas.width;


      /* —— Page 2: chart + detail table —— */
      //doc.addPage();

      // Chart image - centered
      const chartTop = (doc as any).lastAutoTable ? ((doc as any).lastAutoTable.finalY || 0) + 30 : 220;
      const maxChartW = pw - 80; // Leave 40pt margin on each side
      const chartW = Math.min(maxChartW, 600); // Max width of 600pt
      const chartH = (canvas.height * chartW) / canvas.width;
      const chartStartX = (pw - chartW) / 2; // Center the chart
    
      
      try {
        // Add the chart image to PDF
        //doc.addImage(chartImg, "PNG", 320, chartTop, chartW, chartH, undefined, "FAST");
        doc.addImage(chartImg, "PNG", chartStartX, chartTop, chartW, chartH, undefined, "FAST");
        console.log("Chart image added successfully to PDF");
      } catch (imageError) {
        console.error("Error adding image to PDF:", imageError);
        // Add a placeholder text if image fails
        doc.setFontSize(12);
        doc.text("Chart could not be generated", 320, chartTop + 50);
      }


      if(sortedAnomalousSensors.length > 0) {
        // Anomalous Sensors Table
        autoTable(doc, {
          startY: chartTop + chartH + 30,
          //startY: (doc as any).lastAutoTable.finalY + 20,
          head: [["Top Anomalous Sensors", "Count"]],
          body: sortedAnomalousSensors.map(([sensor, count]) => [sensor, count.toString()]),
          theme: "striped",
          styles: { fontSize: 10 },
          margin: { left: 40, right: 40 },
        });
      }
      
      if (sortedNullSensors.length > 0) {
        // Null-prone Sensors Table
        autoTable(doc, {
          startY: sortedAnomalousSensors.length > 0 ? (doc as any).lastAutoTable.finalY + 10 : chartTop + chartH + 30,
          //startY: (doc as any).lastAutoTable.finalY + 10,
          head: [["Top Null-Flagged Sensors", "Count"]],
          body: sortedNullSensors.map(([sensor, count]) => [sensor, count.toString()]),
          theme: "striped",
          styles: { fontSize: 10 },
          margin: { left: 40, right: 40 },
        });
      }




      // Detailed table
      const tableBody = anomalies.map((a) => [
        format(new Date(a.timestamp), "yyyy-MM-dd HH:mm:ss"),
        (a.anomalies?.length ?? 0).toString(),
        (a.nulls?.length ?? 0).toString(),
      ]);
      
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        //startY: chartTop + chartH + 30,
        head: [["Timestamp", "# Anomalies", "# Null Flags"]],
        body: tableBody,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [79, 70, 229] },
        margin: { left: 40, right: 40 },
      });

      doc.save(`anomaly-report_${startDate}_to_${endDate}.pdf`);
      
    } catch (err) {
      console.error("PDF generation error:", err);
      alert(`PDF generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  

  const processChartData = () => {
    return anomalies.map((anomaly) => ({
      timestamp: new Date(anomaly.timestamp).toLocaleString(),//format(new Date(anomaly.timestamp), "HH:mm:ss"),
      anomalies: anomaly.anomalies?.length,
      nulls: anomaly.nulls?.length,
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <NAVBAR />
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Historical Anomaly Viewer</h1>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          className="self-end px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={fetchAnomalies}
        >
          Fetch Anomalies
        </button>

        {/* download pdf */}
        {anomalies.length > 0 && (
          <button
            className="self-end px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={generatePdfReport}
          >
            Download PDF
          </button>
        )}
      </div>

      {loading && <p className="mt-4 text-gray-600">Loading...</p>}

      {anomalies.length > 0 && (
        <div className="mt-6">
          {/* Data Summary */}
          <div className="bg-white p-4 shadow rounded-md mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Data Analysis</h2>
            <p className="text-sm text-gray-600">
              Total Anomalies:{" "}
              <span className="font-bold">
                {anomalies.reduce((sum, a) => sum + a.anomalies?.length, 0)}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Total Null Flags:{" "}
              <span className="font-bold">
                {anomalies.reduce((sum, a) => sum + a.nulls?.length, 0)}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Total (Distinct) Records: <span className="font-bold">{anomalies.length}</span>
            </p>
          </div>

          {/* Chart */}
          <div className="bg-white p-4 shadow rounded-md mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Visualization</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processChartData()} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="anomalies" fill="#8884d8" name="Anomalies" />
                <Bar dataKey="nulls" fill="#82ca9d" name="Null Flags" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="bg-white p-4 shadow rounded-md">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Detailed Data</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Anomalies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Null Flags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {anomalies.map((anomaly) => (
                  <tr key={anomaly.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(anomaly.timestamp), "yyyy-MM-dd HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {anomaly.anomalies?.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {anomaly.nulls?.length}
                    </td>
                    {/* <td className="px-6 py-4 text-sm text-indigo-600 cursor-pointer">
                      <details>
                        <summary className="text-sm font-medium">View Details</summary>
                        <pre className="text-xs text-gray-600 mt-2">
                          {JSON.stringify(anomaly?.sensorData, null, 2)}
                        </pre>
                      </details>
                    </td> */}
                    <td className="px-6 py-4 text-sm text-indigo-600 cursor-pointer">
                        <details>
                          <summary className="text-sm font-medium">View Details</summary>
                          <div className="mt-2 space-y-4">
                            {/* Sensor Values */}
                            <div>
                              <h3 className="text-xs font-semibold text-gray-700 uppercase">Sensor Values (Processed)</h3>
                              <ul className="text-xs text-gray-600 mt-1 space-y-1">
                                <li>Vibration 1: {anomaly?.sensorData?.vibration_1}</li>
                                <li>Vibration 2: {anomaly?.sensorData?.vibration_2}</li>
                                <li>Vibration 3: {anomaly?.sensorData?.vibration_3}</li>
                                <li>RPM: {anomaly?.sensorData?.rpm}</li>
                                <li>Temperature: {anomaly?.sensorData?.temperature}</li>
                              </ul>
                            </div>
                            
                            {/* Anomaly Flags */}
                            <div>
                              <h3 className="text-xs font-semibold text-gray-700 uppercase">Anomaly Flags</h3>
                              <ul className="text-xs text-gray-600 mt-1 space-y-1">
                                <li>Vibration Anomaly: {anomaly?.sensorData?.vibration_anomaly_flag}</li>
                                <li>RPM Anomaly: {anomaly?.sensorData?.rpm_anomaly_flag}</li>
                                <li>Temperature Anomaly: {anomaly?.sensorData?.temperature_anomaly_flag}</li>
                              </ul>
                            </div>

                            {/* Null Flags */}
                            <div>
                              <h3 className="text-xs font-semibold text-gray-700 uppercase">Null Flags</h3>
                              <ul className="text-xs text-gray-600 mt-1 space-y-1">
                                <li>Vibration 1 Null: {anomaly?.sensorData?.vibration_1_null_flag === 1 ? 'True' : 'False'}</li>
                                <li>Vibration 2 Null: {anomaly?.sensorData?.vibration_2_null_flag === 1 ? 'True' : 'False'}</li>
                                <li>Vibration 3 Null: {anomaly?.sensorData?.vibration_3_null_flag === 1 ? 'True' : 'False'}</li>
                                <li>RPM Null: {anomaly?.sensorData?.rpm_1_null_flag === 1 ? 'True' : 'False'}</li>
                                <li>Temperature Null: {anomaly?.sensorData?.temperature_null_flag === 1 ? 'True' : 'False'}</li>
                              </ul>
                            </div>
                            
                            {/* Overall Health */}
                            {/* <div>
                              <h3 className="text-xs font-semibold text-gray-700 uppercase">Overall Health</h3>
                              <p className="text-xs text-gray-600 mt-1">{anomaly?.sensorData?.overall_health_status}</p>
                            </div> */}
                          </div>
                        </details>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {anomalies.length === 0 && !loading && (
        <p className="text-gray-600 mt-4">No anomalies found for the selected period.</p>
      )}

      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>
          © {new Date().getFullYear()} Machine Monitoring System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default AnomalyViewer;


























// import React, { useState } from "react";
// import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
// import { db } from "@/config/firebase";
// import { format } from "date-fns";

// const AnomalyViewer: React.FC = () => {
//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");
//   const [anomalies, setAnomalies] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchAnomalies = async () => {
//     if (!startDate || !endDate) {
//       alert("Please select both start and end dates.");
//       return;
//     }
  
//     setLoading(true);
  
//     try {
//       const anomaliesRef = collection(db, "anomalies");
//       const q = query(
//         anomaliesRef,
//         where("timestamp", ">=", startDate),
//         where("timestamp", "<=", endDate)
//       );
  
//       const querySnapshot = await getDocs(q);
//       const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       console.log(data);
//       setAnomalies(data);
//     } catch (error) {
//       console.error("Error fetching anomalies:", error);
//     } finally {
//       setLoading(false);
//     }
//   };  

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold text-gray-800 mb-4">Historical Anomaly Viewer</h1>

//       <div className="flex flex-col gap-4 md:flex-row">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Start Date</label>
//           <input
//             type="date"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">End Date</label>
//           <input
//             type="date"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//         </div>

//         <button
//           className="self-end px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//           onClick={fetchAnomalies}
//         >
//           Fetch Anomalies
//         </button>
//       </div>

//       {loading && <p className="mt-4 text-gray-600">Loading...</p>}

//       <div className="mt-6">
//         {anomalies.length > 0 ? (
//           <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Timestamp
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Anomalies
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Null Flags
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {anomalies.map((anomaly) => (
//                 <tr key={anomaly.id}>
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {format(new Date(anomaly.timestamp), "yyyy-MM-dd HH:mm:ss")}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">
//                     {anomaly.anomalies?.join(", ")}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">
//                     {anomaly.nulls?.join(", ")}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           !loading && <p className="text-gray-600 mt-4">No anomalies found for the selected period.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AnomalyViewer;
