import React, { useEffect, useState } from 'react'
import NAVBAR from "@/components/navBar";
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';



  return (
    <main className="container-fluid h-100">
      <NAVBAR />
      <div className="m-8">
       Project Initialize 
      </div>
    </main>
  )


export default SchedulePage;
