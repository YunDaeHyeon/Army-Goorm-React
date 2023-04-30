import React, { useState } from 'react'
import { Link } from "react-router-dom";
// react-hook-form 호출
import { useForm } from 'react-hook-form';
// firebase 호출
import firebase from '../../firebase';
import "./LoginPage_style.css";

function LoginPage() {
  /*
    watch : 해당 입력창에 나타나는 이벤트 확인
    errors : 에러 수집
    handleSubmit : 폼에서 submit 버튼을 눌렀을 때
  */
  // useForm()의 내부 파라미터로 mode가 존재한다. ex) mode : "onChange"
  const { register, formState: {errors}, handleSubmit} = useForm({mode : "onBlur"});

  // submit시 나타내는 에러에 대한 state
  const [errorFromSubmit, setErrorFromSubmit] = useState("");

  // loading State
  const [loading, setLoading] = useState(false);

  // onSubmit 이벤트 (비동기)
  const onSubmit = async (data) => {
    try{
      setLoading(true); // submit을 누른 직후는 true
      
      // 로그인 진행
      await firebase
        .auth()
        .signInWithEmailAndPassword(data.email,data.password);

      setLoading(false); // submit을 누르고 회원가입이 완료되면 false
    }catch(error){
      setErrorFromSubmit(error.message);
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 5000);
    }
  }

  return (
    <div className='auth-wrapper'>
      <div style={{textAlign: 'center'}}>
        <h3>Login</h3>
      </div>
      {
        // 해당 handleSubmit(onSubmit)은 react-hook-form인 경우에만.
      }
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          // 아무런 값이 입력되어있지 않거나, 이메일 정규식과 맞지 않으면 오류 반환
          {...register("email", ({ required: true, pattern: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i }))}
        />
        {
          // 만약, errors 객체에 email의 이름을 가진 태그가 있다면 p태그 표시
          errors.email && errors.email.type === "required" &&
          <p>This field is required</p>
        }
        {
          // 만약, errors 객체에 email의 이름을 가진 태그가 있다면 p태그 표시
          errors.email && errors.email.type === "pattern" &&
          <p>This is not a valid email format</p>
        }

        <label>Password</label>
        <input
          name="password"
          type="password"
          {...register("password", ({ required: true, minLength: 6 }))}
        />
        {
          errors.password && errors.password.type === "required" &&
          <p>This password field is required</p>
        }
        {
          errors.password && errors.password.type === "minLength" &&
          <p>Password must have at least 6 characters</p>
        }
    
        { // 만약, errorFromSubmit이 존재한다면 (에러가 발생했다면)
          errorFromSubmit && <p>{errorFromSubmit}</p>
        }

        <input type='submit' disabled={loading}/>
        <Link style={{color:'gray', textDecoration: 'none'}} to="/register">아직 아이디가 없다면...</Link>
      </form>
    </div>
  )
}

export default LoginPage;