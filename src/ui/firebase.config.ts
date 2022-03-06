// Firebase Firestore - v9 modular
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyDN7ouzpRkWijxebiNOaROPxkzYMY9-tt0",
  authDomain: "my-app-1511d.firebaseapp.com",
  projectId: "my-app-1511d",
  storageBucket: "my-app-1511d.appspot.com",
  messagingSenderId: "422028544230",
  appId: "1:422028544230:web:302c307a52ad88665bd327",
});

const db = getFirestore();

export default db;
