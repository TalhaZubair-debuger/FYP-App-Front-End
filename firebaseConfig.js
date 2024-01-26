// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyABlWptVzWF69OQsa-kBf5YjmLptrA6tWk",
  authDomain: "distribution-application-b96ea.firebaseapp.com",
  databaseURL:
    "https://distribution-application-b96ea-default-rtdb.firebaseio.com",
  projectId: "distribution-application-b96ea",
  storageBucket: "distribution-application-b96ea.appspot.com",
  messagingSenderId: "1064496259631",
  appId: "1:1064496259631:web:1913137e9f7bc8f274dcda",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export { app, auth };