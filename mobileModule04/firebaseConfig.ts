import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAG14d73_vPtqrJZE8_sLIatRRsjepJSto",
  authDomain: "diary-app-95a68.firebaseapp.com",
  projectId: "diary-app-95a68",
  storageBucket: "diary-app-95a68.firebasestorage.app",
  messagingSenderId: "994707352543",
  appId: "1:994707352543:web:6bcd945d68bbe2b3b6f26a",
  measurementId: "G-SBYWXTCCET",
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
