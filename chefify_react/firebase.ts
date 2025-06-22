import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDeWUaSLK3DEhMaQSay8lSE3BzgF2KOtc0",
    authDomain: "chefify-7cac2.firebaseapp.com",
    projectId: "chefify-7cac2",
    storageBucket: "chefify-7cac2.firebasestorage.app",
    messagingSenderId: "535109878535",
    appId: "1:535109878535:web:a9d5d0b7ebff62cd4d7ba2",
    measurementId: "G-58N0XR366Z",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { app, auth };
