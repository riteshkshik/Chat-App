import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlFmwlizo_P9lu1I_dJFnNeZCexEaiiRo",
  authDomain: "chat-app-55372.firebaseapp.com",
  projectId: "chat-app-55372",
  storageBucket: "chat-app-55372.appspot.com",
  messagingSenderId: "638160760877",
  appId: "1:638160760877:web:e9b425537b1497b55088a4",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
