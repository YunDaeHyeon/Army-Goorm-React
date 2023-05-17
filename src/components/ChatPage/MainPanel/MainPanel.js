// 해당 코드는 클래스 컴포넌트와 함수형 컴포넌트가 합쳐짐.
import React, { Component } from 'react'
import MessageHeader from './MessageHeader'
import MessageForm from './MessageForm'
import Message from './Message'
import { connect } from 'react-redux';
import firebase from '../../../firebase';

export class MainPanel extends Component {

  state = {
    // firebase 접근 state
    messagesRef: firebase.database().ref("messages"),
    // 각 채팅방에 존재하는 메시지들 저장 용도
    messages: [],
    // 로딩
    messagesLoading: true,
  }

  componentDidMount(){ // 컴포넌트 마운트 시
    const { chatRoom } = this.props; // props(state)에 존재하는 chatRoom 가져오기

    if(chatRoom){ // chatRoom이 존재하면 (존재하지 않다는 것은 에러.)
    // 매개변수는 클릭한 채팅방의 id를 가져와 이를 토대로 메시지 호출
    this.addMessagesListeners(chatRoom.id);
    }
  }

  addMessagesListeners = (chatRoomId) => {
    let messagesArray = [];
    this.state.messagesRef
      .child(chatRoomId)
      // child_added 이벤트 리스너 실행 (실시간으로 데이터 가져오기)
      .on("child_added", DataSnapshot => {
        messagesArray.push(DataSnapshot.val());
        this.setState({ 
          // 실시간으로 불러온 데이터(messageArray)를 messages(state)로 이동
          messages: messagesArray,
          // 최초 데이터 불러올 때는 로딩중, (true) 완료 시 false
          messagesLoading : false,
        });
      })
  }

  renderMessages = (messages) => {
    messages.length > 0 && // messages가 하나 이상의 메시지를 가지고 있다면
    // Message Component 사용
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.props.user}
      />
    ))
  }

  render() {
    // render()가 실행될때마다 state에서 messages 가져오기
    const { messages } = this.state;
    return (
        <div style={{ padding: '2rem 2rem 0 2rem'}}>
            
            <MessageHeader/>

            <div style={{
                width: '100%',
                height: '450px',
                border: '.2rem solid #ececec',
                borderRadius: '4px',
                padding: '1rem',
                marginBottom: '1rem',
                overflowY: 'auto'
            }}>
            </div>
              {this.renderMessages(messages)}
            <MessageForm/>

        </div>
    )
  }
}

// redux에 있는 state를 prop으로 호출
const mapStateToProps = state => {
  return{
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom
  }
}

export default connect(mapStateToProps)(MainPanel);