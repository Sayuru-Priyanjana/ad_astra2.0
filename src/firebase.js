import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCQICQXLF28v9iN9D_eOb78xmPGNlykDoo",
  authDomain: "ad-astra-2-dashboard.firebaseapp.com",
  databaseURL: "https://ad-astra-2-dashboard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ad-astra-2-dashboard",
  storageBucket: "ad-astra-2-dashboard.firebasestorage.app",
  messagingSenderId: "731367414171",
  appId: "1:731367414171:web:27efcdc92a4c586db5293e"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue, update };