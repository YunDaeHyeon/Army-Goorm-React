import React, { useRef } from 'react'
import { Link } from "react-router-dom";
// react-hook-form 호출
import { useForm } from 'react-hook-form';

import "./RegisterPage_style.css";

function RegisterPage() {
  /*
    watch : 해당 입력창에 나타나는 이벤트 확인
    errors : 에러 수집
  */
  // useForm()의 내부 파라미터로 mode가 존재한다. ex) mode : "onChange"
  const { register, watch, formState: {errors}} = useForm({mode : "onBlur"});

  // name : password의 DOM 가져오기
  const password = useRef();
  // password의 필드 값(current)을 watch로 가져오기
  password.current = watch("password");

  // name : email의 input 관찰
  // console.log(watch("email"));

  return (
    <div className='auth-wrapper'>
      <div style={{textAlign: 'center'}}>
        <h3>Register</h3>
      </div>
      <form>
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
        <label>Name</label>
        <input
          name="name"
          {...register("name", ({ required: true, maxLength : 10 }))}
        />
        { // errors.name에 존재하는 에러 중 required 에러라면 해당 p 태그 반환
          errors.name && errors.name.type === "required" &&
          <p>This name field is required</p>
        }
        { // errors.name에 존재하는 에러 중 maxLength 에러라면 해당 p 태그 반환
          errors.name && errors.name.type === "maxLength" &&
          <p>Your input exceed maximum length</p>
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
        <label>Password Confirm</label>
        <input
          name="password_confirm"
          type="password"
          {...register("password_confirm", ({
            required: true, // name password(password.current)와 name password_confirm이 같으면.
            // value : password_confirm의 내용
            // password.current : useRef로 가져온 password의 내용
            validate: (value) => value === password.current
          }))}
        />
        {
          errors.password_confirm && errors.password_confirm.type === "required" &&
          <p>This password confirm field is required</p>
        }
        {
          errors.password_confirm && errors.password_confirm.type === "validate" &&
          <p>The passwords do not match</p>
        }
        <input type='submit'/>
        <Link style={{color:'gray', textDecoration: 'none'}} to="/login">이미 아이디가 있다면...</Link>
      </form>
    </div>
  )
}

export default RegisterPage;