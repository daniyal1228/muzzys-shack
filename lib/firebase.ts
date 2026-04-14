import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5mUavEUn7nmjs7TqHbWCR25ApFzlVWDs",
  authDomain: "muzzys-shack.firebaseapp.com",
  projectId: "muzzys-shack",
  storageBucket: "muzzys-shack.firebasestorage.app",
  messagingSenderId: "989824105717",
  appId: "1:989824105717:web:17365503b93dc5088899bc",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("FIREBASE APP:", app);
console.log("FIREBASE AUTH:", auth);