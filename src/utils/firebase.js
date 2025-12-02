// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB8dw8eZjxj5-jrO0Msu2OGOXNhTlUSC5Y",
    authDomain: "fexora-5c041.firebaseapp.com",
    projectId: "fexora-5c041",
    storageBucket: "fexora-5c041.firebasestorage.app",
    messagingSenderId: "853763228116",
    appId: "1:853763228116:web:495f79a8238469dddfd641",
    measurementId: "G-DL1SHRSBZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);