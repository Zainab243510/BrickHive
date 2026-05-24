
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuT4BSBtEA3VDhqrcQiYIjw5B4hjCPmws",
  authDomain: "brickhive-2b8cc.firebaseapp.com",
  projectId: "brickhive-2b8cc",
  storageBucket: "brickhive-2b8cc.firebasestorage.app",
  messagingSenderId: "631913101450",
  appId: "1:631913101450:web:4a13fdd712842399ecd573",
  measurementId: "G-JS9D7VYM32"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);