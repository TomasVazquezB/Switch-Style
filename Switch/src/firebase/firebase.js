// src/firebase/firebase.js
// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCcHu0LaExsVxyx3uwNOwz5hTlk8Av0cgc",
  authDomain: "petpalms-717eb.firebaseapp.com",
  databaseURL: "https://petpalms-717eb-default-rtdb.firebaseio.com",
  projectId: "petpalms-717eb",
  storageBucket: "petpalms-717eb.firebasestorage.app",
  messagingSenderId: "601238341796",
  appId: "1:601238341796:web:2399fd95db0b8cabda3e31",
  measurementId: "G-KDL4D0NL6Q"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
