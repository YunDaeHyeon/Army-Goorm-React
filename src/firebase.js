import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import "firebase/compat/database";

// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1_AeEkJxuZsJb8xVebd7XfgZCpdQI7mo",
  authDomain: "sw-study-army.firebaseapp.com",
  projectId: "sw-study-army",
  storageBucket: "sw-study-army.appspot.com",
  messagingSenderId: "1028150656870",
  appId: "1:1028150656870:web:f9f981b70cf4793360d2a7",
  measurementId: "G-EPXNHCGVVM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default firebase;