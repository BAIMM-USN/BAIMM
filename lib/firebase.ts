// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr7lo2u_wTjODERWRcasdjxbsQ2Wvmeac",
  authDomain: "baimm-58404.firebaseapp.com",
  projectId: "baimm-58404",
  storageBucket: "baimm-58404.firebasestorage.app",
  messagingSenderId: "561212997161",
  appId: "1:561212997161:web:5d6f423a7555cb6a422638"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);