import {
    SET_CURRENT_CHAT_ROOM
} from './types';

// 채팅방 리스트 상태 변환 action
export function setCurrentChatRoom(currentChatRoom){
    return{
        type: SET_CURRENT_CHAT_ROOM,
        payload: currentChatRoom
    }
}
