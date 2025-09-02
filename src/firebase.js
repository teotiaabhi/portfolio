// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";


// 🔥 Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDpYCmIKZlJM80TBnwghQt2J3GHxCXORN8",
  authDomain: "portfolio-ec1cd.firebaseapp.com",
  databaseURL: "https://portfolio-ec1cd-default-rtdb.firebaseio.com",
  projectId: "portfolio-ec1cd",
  storageBucket: "portfolio-ec1cd.firebasestorage.app",
  messagingSenderId: "767746268645",
  appId: "1:767746268645:web:3a7ee44e61548e2fc3a30c",
  measurementId: "G-5CV5NQ8XSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser does not support all of the features required to enable persistence');
  }
});

export { db, app }; // Export both db and app if needed elsewhere
