import {
    SET_USER,
    CLEAR_USER,
    SET_PHOTO_URL
} from './types';

// 유저 상태 변환 Action 생성 함수
export function setUser(user){
    return{
        type: SET_USER, // type은 액션의 이름.
        payload: user // 넘어온 유저의 정보를 reducer로 전달
    }
}

// 유저 상태 제거 Action 생성 함수
export function clearUser(){
    return{
        type: CLEAR_USER
    }
}

// 프로필 이미지 변경 Action 생성 함수
export function setPhotoURL(photoURL){
    return{
        type: SET_PHOTO_URL,
        payload: photoURL
    }
}