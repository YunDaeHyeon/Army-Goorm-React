// 해당 코드는 클래스 컴포넌트와 함수형 컴포넌트가 합쳐짐.
import React, { Component } from 'react';
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import { connect } from 'react-redux';
import firebase from '../../../firebase';
// components
import Skeleton from '../../../commons/components/Skeleton';

export class MainPanel extends Component {
  // Class 컴포넌트 ref 생성
  messageEndRef = React.createRef();

  state = {
    // firebase 접근 state
    messagesRef: firebase.database().ref("messages"),
    // 각 채팅방에 존재하는 메시지들 저장 용도
    messages: [],
    // 로딩
    messagesLoading: true,

    // 검색을 진행하기 위한 state들
    searchTerm: "", // 사용자가 검색한 내용
    searchResults: [], // 사용자가 검색한 내용과 비슷한 내용 저장
    searchLoading: false, // 검색이 이루어지는 동안 로딩
    // 타이핑 ref
    typingRef: firebase.database().ref("typing"),
    // 타이핑 state
    typingUsers: [],
  }

  componentDidMount() { // 컴포넌트 마운트 시
    const { chatRoom } = this.props; // props(state)에 존재하는 chatRoom 가져오기

    if (chatRoom) { // chatRoom이 존재하면 (존재하지 않다는 것은 에러.)
      // 매개변수는 클릭한 채팅방의 id를 가져와 이를 토대로 메시지 호출
      this.addMessagesListeners(chatRoom.id);
      // 타이핑 정보 불러오기
      this.addTypingListeners(chatRoom.id);
    }
  }

  componentDidUpdate(){ // 컴포넌트 업데이트 시
    // 해당 ref가 존재할 때
    if(this.messageEndRef){
      this.messageEndRef.scrollIntoView({ behavior: "smooth"});
    }
  }

  // 타이핑 정보 불러오기
  addTypingListeners = (chatRoomId) => {
    // 타이핑 관련 유저 정보
    let typingUsers = [];
    // typing child가 추가되는 이벤트 감시 리스너(타이핑 진행 중)
    this.state.typingRef.child(chatRoomId).on("child_added",
      DataSnapshot => {
        // 본인이 타이핑 중인 상황은 제외한다.
        if (DataSnapshot.key !== this.props.user.uid) {
          // concat : 새로운 배열 생성
          typingUsers = typingUsers.concat({
            id: DataSnapshot.key,
            name: DataSnapshot.val()
          });
          // 불러와진 타이핑 정보 state 추가
          this.setState({ typingUsers });
        }
      })

    // typing child가 제거되는 이벤트 감시 리스너 (타이핑이 끝나거나 안할 때)
    this.state.typingRef.child("chatRoomId").on("child_removed",
      DataSnapshot => {
        // typingUsers state안에 존재하는 유저 정보가 삭제된 타이핑 정보에 존재하면
        // index 반환, 만약 정보가 존재하지 않으면 -1 반환
        const index = typingUsers.findIndex(user => user.id === DataSnapshot.key);
        // 만약, 지워진 유저 정보가 존재한다면 기존 state에서 해당 유저 제거
        if (index !== -1) {
          typingUsers = typingUsers.filter(user => user.id !== DataSnapshot.key);
          this.setState({ typingUsers });
        }
      });
  }

  /*
    검색을 수행하는 컴포넌트는 MessageHeader(MainPanel 기준 자식).
    하지만 실제 검색을 수행시키는 로직이 존재하는 컴포넌트는
    MainPanel(부모)이기에 이를 연결한다.
  */
  handleSearchChange = event => {
    // MessageHeader 컴포넌트에 존재하는 검색창 onChange 이벤트 연동
    this.setState({
      searchTerm: event.target.value,
      searchLoading: true
    },
      () => this.handleSearchMessages());
  }

  // 실제 검색이 이루어지는 로직
  handleSearchMessages = () => {
    // state에 존재하는 messages 호출
    const chatRoomMessages = [...this.state.messages];
    // 정규식 생성
    const regex = new RegExp(this.state.searchTerm, "gi");
    // 메시지가 들어있는 배열(chatRoomMessages)을 정규식 판별(reduce)
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      // 검색한 내용과 메시지가 match하거나
      // 검색한 내용과 사용자 이름이 match하면
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        // acc(누산기)에 일치하는 데이터 저장
        acc.push(message);
      }
      // 누적된 데이터(일치되는 데이터들) 반환
      return acc;
    }, []);
    // 검색 결과(acc = searchResults)를 state에 저장
    this.setState({ searchResults });
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
          messagesLoading: false,
        });
      })
  }

  renderMessages = (messages) =>
    messages.length > 0 && // messages가 하나 이상의 메시지를 가지고 있다면
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.props.user}
      />
    ))

  // 타이핑 중
  renderTypingUsers = (typingUsers) =>
    // 해당 사용자가 타이핑 중이라면
    typingUsers.length > 0 &&
    typingUsers.map(user => (
      <span>{user.name}님이 채팅을 입력하고 있습니다...</span>
    ));

  // 스켈레톤 애니메이션 처리
  renderMessageSkeleton = (loading, messages) =>
      // loading이 true 일때만 (데이터가 다 불러와지지 않았을 때)
      // 똑같은 컴포넌트를 N번 이상 나타내고 싶을 때는 Array Constructor 사용
      loading && (
        <>
          { [...Array(10)].map((undefined, i) => (
            <Skeleton key={i}/>
          ))
          }
        </>
      )

  render() {
    // render()가 실행될때마다 state에서 messages, searchTerm, searchResults 가져오기
    const { messages, searchTerm, searchResults, typingUsers, messagesLoading } = this.state;

    return (
      <div style={{ padding: '2rem 2rem 0 2rem' }}>

        <MessageHeader handleSearchChange={this.handleSearchChange} />

        <div style={{
          width: '100%',
          height: '450px',
          border: '.2rem solid #ececec',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1rem',
          overflowY: 'auto'
        }}>
          { // 스켈레톤 애니메이션 처리
            this.renderMessageSkeleton(messagesLoading, messages)
          }
          { // 만약 검색한 뒤 결과가 존재한다면 검색한 내용 렌더링
            searchTerm ?
              this.renderMessages(searchResults) :
              // 만약, 검색을 하지 않았다면 원래대로
              this.renderMessages(messages)
          }
          {this.renderTypingUsers(typingUsers) /* 타이핑 중이라는 UI 렌더링 */}
          {/* 스크롤 자동 내려가기 기준 (node : 해당 element 가져오기) */}
          <div ref={node => (this.messageEndRef = node)}/> 
        </div>

        <MessageForm />

      </div>
    )
  }
}

// redux에 있는 state를 prop으로 호출
const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom
  }
}

export default connect(mapStateToProps)(MainPanel);