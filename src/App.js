import {
  Routes, Route, useNavigate
} from "react-router-dom";
import { useEffect } from "react";

import ChatPage from "./components/ChatPage/ChatPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";

import firebase from './firebase';

// redux 호출 (Dispatch는 상태 저장, Selector는 상태 호출)
import { useDispatch, useSelector } from "react-redux";
// redux 커스텀 action 호출
import { setUser } from "./redux/actions/user_action";

function App() {
  let navigate = useNavigate();
  let dispatch = useDispatch(); // 상태 저장
  const isLoading = useSelector(state => state.user.isLoading); // 상태 호출

  useEffect(()=>{
    // onAuthStateChanged는 유저의 상태가 계속 변경되는지 지켜보는 옵저버(Observer) 메서드
    // 유저의 상태가 변경될 때 마다 주기적으로 반환한다.
    firebase.auth().onAuthStateChanged(user => {
      if(user){ // user 객체가 존재하면 로그인이 된 상태
        navigate("/");
        // 유저의 정보를 redux로 넘겨주기 위해 dispatch 진행 setUser이라는 action 이용
        dispatch(setUser(user));
      }else{ // user 객체가 존재하지 않으면 로그인 X
        navigate("/login");
      }
    })
  }, [navigate, dispatch]);

  // // 유저의 정보가 불러오는 중이라면 Loading 중 호출
  // if(isLoading){ // true : 불러오는 중
  //   return(
  //     <div>
  //       ...Loading
  //     </div>
  //   );
  // }else{ // 불러와졌다면, false : 완료
    return(
      <Routes>
        <Route path="/" element={<ChatPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
      </Routes>
    );
  //  }
}

export default App;

