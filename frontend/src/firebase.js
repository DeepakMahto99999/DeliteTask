// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "delitetask.firebaseapp.com",
  projectId: "delitetask",
  storageBucket: "delitetask.firebasestorage.app",
  messagingSenderId: "502866310208",
  appId: "1:502866310208:web:b67597d51751924580dba5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);