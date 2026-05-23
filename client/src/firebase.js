
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "brick-and-click-8a281.firebaseapp.com",
  projectId: "brick-and-click-8a281",
  storageBucket: "brick-and-click-8a281.firebasestorage.app",
  messagingSenderId: "756322469559",
  appId: "1:756322469559:web:90905b1edb64726dc06f32",
  measurementId: "G-0MRE98F976"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);