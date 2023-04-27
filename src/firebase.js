import firebase from "firebase/app";
import "firebase/auth"; // 파이어베이스 - 인증
import "firebase/database"; // 파이어베이스 - 데이터베이스
import "firebase/storage"; // 파이어베이스 - 스토리지

var firebaseConfig = {
    apiKey : "",
    authDomain: "",
    databaseURL : "",
    projectId : "",
    storageBucket : "",
    messagingSenderId : "",
    appId : "",
    measurementId : "",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();