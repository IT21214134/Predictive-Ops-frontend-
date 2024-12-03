// import React from 'react';
// import clsx from 'clsx';

// interface AnomalyCardProps {
//   title: string;
//   status: string;
//   anomaly: string;
// }

// const AnomalyCard: React.FC<AnomalyCardProps> = ({ title, status, anomaly }) => {
//   const isAnomalous = anomaly !== "Normal";

//   return (
//     <div
//       className={clsx(
//         "p-4 rounded-lg shadow-lg",
//         isAnomalous ? "bg-red-100 border-red-500" : "bg-green-100 border-green-500"
//       )}
//     >
//       <h3 className="text-lg font-semibold">{title}</h3>
//       <p>Status: {status}</p>
//       <p>Anomaly: {anomaly}</p>
//     </div>
//   );
// };

// export default AnomalyCard;
import React from 'react';
import clsx from 'clsx';

interface AnomalyCardProps {
    title: string;
    status: string;
    anomaly: string;
    isNull: boolean;
}

const AnomalyCard: React.FC<AnomalyCardProps> = ({ title, status, anomaly, isNull }) => {
    const isAnomalous = anomaly !== "Normal";
    return (
        <div className={clsx("p-4 border rounded shadow bg-white", isAnomalous ? "bg-red-100 border-red-500" : "bg-green-100 border-green-500")}>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p>Status: <span className="font-bold">{status}</span></p>
            <p>Null Occurance: <span className={!isNull ? 'text-green-500' : 'text-red-500'}>
                {isNull ? 'True' : 'False'}
            </span></p>
            <p>Anomaly: <span className={anomaly === 'Normal' ? 'text-green-500' : 'text-red-500'}>
                {anomaly}
            </span></p>
        </div>
    );
};

export default AnomalyCard;
