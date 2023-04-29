import { initializeApp } from "firebase/app";
import "firebase/auth"; // 파이어베이스 - 인증
import "firebase/database"; // 파이어베이스 - 데이터베이스
import "firebase/storage"; // 파이어베이스 - 스토리지

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
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);