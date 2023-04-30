import {
  Routes, Route, useNavigate
} from "react-router-dom";
import { useEffect } from "react";

import ChatPage from "./components/ChatPage/ChatPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";

import firebase from './firebase';

function App() {
  let navigate = useNavigate();

  useEffect(()=>{
    // onAuthStateChanged는 유저의 상태가 계속 변경되는지 지켜보는 옵저버(Observer) 메서드
    // 유저의 상태가 변경될 때 마다 주기적으로 반환한다.
    firebase.auth().onAuthStateChanged(user => {
      if(user){ // user 객체가 존재하면 로그인이 된 상태
        navigate("/");
      }else{ // user 객체가 존재하지 않으면 로그인 X
        navigate("/login");
      }
    })
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<ChatPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
    </Routes>
  );
}

export default App;

