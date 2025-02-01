import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9KefXHDLX3shwazUaK28eP_kkjOKNOZI",
  authDomain: "secret-crush-a5a16.firebaseapp.com",
  projectId: "secret-crush-a5a16",
  storageBucket: "secret-crush-a5a16.firebasestorage.app",
  messagingSenderId: "739539931369",
  appId: "1:739539931369:web:d7feb5237f102a6b0e6078",
  measurementId: "G-DQRKSKZS4Y"
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