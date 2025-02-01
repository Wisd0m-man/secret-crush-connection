import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOnx3JQ9cH9GKwT_BK9YxQjbGBGnUq_Ow",
  authDomain: "crush-matcher.firebaseapp.com",
  projectId: "crush-matcher",
  storageBucket: "crush-matcher.appspot.com",
  messagingSenderId: "581111574556",
  appId: "1:581111574556:web:9f9f9f9f9f9f9f9f9f9f9f",
  measurementId: "G-MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});