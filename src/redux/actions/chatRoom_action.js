import {
    SET_CURRENT_CHAT_ROOM,
    SET_PRIVATE_CHAT_ROOM
} from './types';

// 채팅방 리스트 상태 변환 action
export function setCurrentChatRoom(currentChatRoom){
    return{
        type: SET_CURRENT_CHAT_ROOM,
        payload: currentChatRoom
    }
}

// 현재 대화중인 채팅방의 접근 권한(public, private) 상태
export function setPrivateChatRoom(isPrivateChatRoom){
    return{
        type: SET_PRIVATE_CHAT_ROOM,
        payload: isPrivateChatRoom
    }
}

