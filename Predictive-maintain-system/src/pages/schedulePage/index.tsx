import React, { useEffect, useState } from 'react';
import NAVBAR from "@/components/navBar";
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCKD_ZjeoK0-mqQOebbLYKmnXAt0CQkY2A",
  authDomain: "predictivemaintenancesystem.firebaseapp.com",
  projectId: "predictivemaintenancesystem",
  storageBucket: "predictivemaintenancesystem.firebasestorage.app",
  messagingSenderId: "301576079277",
  appId: "1:301576079277:web:09b3d0d063246a591d4324"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function SchedulePage() {
  const [failureList, setFailureList] = useState([]);

  useEffect(() => {
    const fetchFailureTypes = async () => {
      const issueCollection = collection(db, 'Issue list');
      const q = query(issueCollection);
      const snapshot = await getDocs(q);
      const failures = snapshot.docs
        .map(doc => doc.data())
        .filter(item => item['Failure Type'] !== 'No Failure')
        .sort((a, b) => {
          const priority = { 'H': 1, 'M': 2, 'L': 3 };
          return priority[a.Type] - priority[b.Type];
        })
        .slice(0, 10); 
      setFailureList(failures);
    };
    fetchFailureTypes();
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getTimeIntervals = () => {
    const intervals = [];
    let currentTime = new Date();
    for (let i = 0; i < failureList.length; i++) {
      const start = new Date(currentTime);
      const end = new Date(currentTime.setHours(currentTime.getHours() + 5));
      intervals.push(`${formatTime(start)} to ${formatTime(end)}`);
      currentTime = end;
    }
    return intervals;
  };

  const timeIntervals = getTimeIntervals();

  return (
    <main className="container-fluid h-100">
      <NAVBAR />
      <div className="m-8">
        <span className="font-bold text-center text-4xl" style={{ color: "#39B39B" }}>
            Prioritizing Maintenance Schedules
        </span>
      </div>
      <div className="flex flex-col sm:flex-row items-center m-8 mb-10">
        <div className="w-full sm:grid sm:grid-cols-2">
          <div className="w-11/12">
            <span className="text-base sm:text-lg font-bold">Automatically prioritize the maintenance schedules weekly based on the severity.</span>
            <form>
                <div className="rounded-xl shadow-md h-full mt-8" style={{ backgroundColor: "#EEFFFF" }}>
                  <div className="grid grid-cols-1 gap-2 p-5">
                    <span className="font-semibold">xxxxx</span>
                    <span className="font-semibold">xxxxx</span>
                  </div>
                </div>
                <div className="flex justify-start mt-10">
                  <button
                    type="button"
                    className="font-bold text-white shadow-md p-2 rounded-lg w-full"
                    style={{ backgroundColor: "#033CAA" }}
                  >
                    Start prioritizing process
                  </button>
                </div>
            </form>
          </div>

          <div className="rounded-xl w-11/12 h-full shadow-md" style={{ backgroundColor: "#EEFFFF" }}>
            <form>
                <div className="grid grid-cols-1 gap-5 m-8">
                  <span className="text-lg font-bold">Scheduled Result:</span>
                  <div className="grid grid-cols-2">
                    <div className='grid grid-cols-1 gap-2'>
                      {failureList.map((failure, index) => (
                        <span key={index} className="font-semibold">{index + 1}. {failure['Failure Type']}</span>
                      ))}
                    </div>
                    <div className='grid grid-cols-1 gap-2'>
                      {timeIntervals.map((interval, index) => (
                        <span key={index} className="font-semibold">{interval}</span>
                      ))}
                    </div>
                  </div>
                </div>
            </form>
          </div>
        </div>
      </div>
      <div className="m-8 ms-w-full grid grid-cols-2">
        <span className="text-lg font-bold">After checking issues mechanic identify not issues in predicted result.</span>
      </div>
      <div className="m-8 w-11/12">
        <input type="text" className="w-full me-5 border py-3 h-32 rounded-lg shadow-md" />
        <div className='flex justify-end mt-5'>
          <button
            type="button"
            className="font-bold text-white shadow-md p-3 rounded-lg w-24"
            style={{ backgroundColor: "#033CAA" }}
          >
            Report
          </button>
        </div>
      </div>
    </main>
  );
}

export default SchedulePage;
