// Action의 Type(이름) 가져오기
import {
    SET_USER,
    CLEAR_USER,
    SET_PHOTO_URL
} from "../actions/types";

const initialUserState = { 
    // currentUser : 사용자 정보
    currentUser: null, // 최초 사용자 정보는 존재하지 않기에 null
    isLoading: true // 만약, 로그인 중일 때 처리
}

// 로그인 성공 시
// 리듀서 정의 (State에 변화를 일으킴)
// first @param : 이전 상태, second @param : 액션 객체
export default function(state = initialUserState, action){
    switch(action.type){ // 액션 객체의 타입에 따라서 (다양한 액션 객체 존재)
        // 만약 특정 action에 대한 상태가 변경되면
        case SET_USER:
            return{
                ...state,
                currentUser: action.payload, // action에서 넘어온 유저의 정보
                isLoading: false, // 로딩 완료
            }
        // 로그아웃 혹은 사이트 최초 접속
        case CLEAR_USER:
            return{
                ...state,
                currentUser: 'null',
                isLoading: false,
            }
        // 프로필 이미지 변경
        case SET_PHOTO_URL:
            return{
                ...state,
                // 기존 상태는 전부 그대로, photoURL만 변경
                currentUser: {...state.currentUser, photoURL: action.payload},
                isLoading: false
            }
        // 만약 변경될 상태가 존재하지 않는다면
        default:
            return state; // 기존에 존재한 상태 반환
    }
}