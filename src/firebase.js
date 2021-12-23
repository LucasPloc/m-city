import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  addDoc,
  limit,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCewXUyEQ6SJXsEM1xQtWBBpS-kZAei-rE",
  authDomain: "ball-7b510.firebaseapp.com",
  projectId: "ball-7b510",
  storageBucket: "ball-7b510.appspot.com",
  messagingSenderId: "1033512901194",
  appId: "1:1033512901194:web:5fe7ff30ed5ec440b424b3",
  measurementId: "G-T1VDXYY7WB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const DB = getFirestore();
const storage = getStorage(app);
const playersRef = ref(storage, "players");

export {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getDocs,
  DB,
  collection,
  where,
  query,
  addDoc,
  limit,
  doc,
  updateDoc,
  storage,
  playersRef,
  ref,
  uploadBytes,
};
