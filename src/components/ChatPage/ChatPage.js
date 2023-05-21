import React from 'react'
// Main panel, Side panel import
import MainPanel from './MainPanel/MainPanel'
import SidePanel from './SidePanel/SidePanel'
// react-redux
import { useSelector } from 'react-redux'
// import { v4 as uuidv4 } from 'uuid';

// 사이드, 메인 패널에는 각각 고유한 key를 부여해야 정상적으로
// render가 된다.

function ChatPage() {
  const currentUser = useSelector(state => state.user.currentUser);
  const currentChatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  return (
    <div style={{ display: 'flex'}}>
        <div style={{ width: '300px'}}>
          <SidePanel key={currentUser && currentUser.uid}/>
        </div>
        <div style={{ width: '100%'}}>
          {/* currentChatRoom이 있을 때 렌더링 진행 */}
          <MainPanel key={currentChatRoom && currentChatRoom.id}/>
        </div>
    </div>
  )
}

export default ChatPage