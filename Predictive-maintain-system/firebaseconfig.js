import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCKD_ZjeoK0-mqQOebbLYKmnXAt0CQkY2A",
  authDomain: "predictivemaintenancesystem.firebaseapp.com",
  projectId: "predictivemaintenancesystem",
  storageBucket: "predictivemaintenancesystem.firebasestorage.app",
  messagingSenderId: "301576079277",
  appId: "1:301576079277:web:09b3d0d063246a591d4324"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);


export { app, auth, firestore, storage,database };