// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDv_8EKj6XGxuYKSLk-zi1mR-wzvBf8ouc",
  authDomain: "pitchcarft.firebaseapp.com",
  projectId: "pitchcarft",
  storageBucket: "pitchcarft.firebasestorage.app",
  messagingSenderId: "86796747375",
  appId: "1:86796747375:web:0f8e00a4534a5d4b13c39a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app

