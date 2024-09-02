// Import necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDiBSaSmqH6VF_Gd6qFiOhX0INEw_GKAgs", // API key for authentication
    authDomain: "wealth-watcher-a5747.firebaseapp.com", // Domain for authentication
    projectId: "wealth-watcher-a5747", // Firebase project ID
    storageBucket: "wealth-watcher-a5747.appspot.com", // Storage bucket for files
    messagingSenderId: "468586607471", // Sender ID for messaging
    appId: "1:468586607471:web:4dbac8601875907cea2e9a", // Application ID
    measurementId: "G-5RWMXB588B" // Analytics measurement ID
};

// Initialize Firebase with the configuration object
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
