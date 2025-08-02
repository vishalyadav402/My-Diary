// Replace with your Firebase config
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCE2vy-8SaiaEpalJMF64FCqE9ncopHBss",
  authDomain: "salon-booking-app-4daac.firebaseapp.com",
  projectId: "salon-booking-app-4daac",
  storageBucket: "salon-booking-app-4daac.firebasestorage.app",
  messagingSenderId: "469999257632",
  appId: "1:469999257632:web:6850fbf37328a239af9445",
  measurementId: "G-D2EBGESQ41"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
