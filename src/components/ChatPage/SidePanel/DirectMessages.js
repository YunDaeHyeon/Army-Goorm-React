import React, { Component } from 'react'
// react-icons
import { FaRegSmile } from 'react-icons/fa';
// firebase
import firebase from '../../../firebase';
// redux
import { connect } from 'react-redux';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';

export class DirectMessages extends Component {

  state = { 
    // 파이어베이스 DB 접근 (users 테이블)
    usersRef : firebase.database().ref("users"),
    // 현재 접속중인 사용자 리스트
    users: [],
    activeChatRoom: "", // 각 DM방을 의미 
  }

  componentDidMount(){
    // 현재 사용자가 존재할 때
    if(this.props.user){
      this.addUsersListeners(this.props.user.uid);
    }
  }

  // 사용자 목록 불러오기
  addUsersListeners = (currentUserId) => {
    const { usersRef } = this.state;
    let usersArray = [];
    // 사용자 정보가 DB에 추가될 때 마다 불러오기
    usersRef.on("child_added", Datasnapshot => {
      // 자기 자신은 제외한 모든 사용자 리스트 불러오기
      // .key는 해당 child의 PK를 의미 (즉, user의 id)
      if(currentUserId !== Datasnapshot.key){
        // 불러온 데이터의 값을 저장
        let user = Datasnapshot.val();
        user["uid"] = Datasnapshot.key; // 불러온 데이터의 PK 저장
        user["status"] = "offline"; // 해당 사용자가 접속중인지 판별
        usersArray.push(user);
        this.setState({ users: usersArray });
      }
    });
  }

  // DirectMessage에 사용될 chatRoom ID 생성
  getChatRoomId = (userId) => {
    // userId : 클릭한 유저의 ID
    // currentUserId : 자기 자신의 ID
    const currentUserId = this.props.user.uid;

    // 만약, 클릭한 사용자의 ID가 자기 자신의 ID보다 크다면
    return userId > currentUserId 
    // DirectMessageChatRoomId는 "클릭한 사용자 ID"/"자기 자신의 ID"
    ? `${userId}/${currentUserId}`
    // 작지 않다면 "자기 자신의 ID"/"클릭한 사용자 ID"
    : `${currentUserId}/${userId}`;
    // 이런 로직을 구성한 이유는 자기 자신이나
    // 어떤 사람과 직접적으로 채팅을 하기 위해서는
    // 둘 다 동일한 ChatRoom을 사용해야한다.
    // 그러므로 동일한 채팅방 ID가 존재해야한다.
  }

  // 사용자 리스트 클릭 (user : 각 사용자의 정보)
  changeChatRoom = (user) => {
    const chatRoomId = this.getChatRoomId(user.uid);
    // 클릭한 사용자와 대화할 방(DM)을 생성하기 위한 정보 생성
    const chatRoomData = {
      id: chatRoomId,
      name: user.name, // 상대방의 이름으로 방 이름 생성 
    }
    // 생성한 정보를 redux에 업로드
    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    // DM은 private room을 명시. (현재 대화중인 방(DM)은 private방)
    this.props.dispatch(setPrivateChatRoom(true));
    // 해당 사용자 클릭 시(DM대화방)
    this.setActiveChatRoom(user.uid); // 선택한 사용자의 id 전달
  }

  // 각 DM 클릭(active) 함수
  setActiveChatRoom = (userId) => {
    this.setState({ activeChatRoom: userId });
  }

  // JS에서 {}가 존재하면 반환값이 존재해야함.
  renderDirectMessages = (users) => 
    users.length > 0 && // 사용자가 1명 이상 존재하면
    users.map(user => (
      <li 
        key={user.uid} 
        style={{ // 클릭한 채팅방(사용자) 클릭 시(active) 색상 변경
          backgroundColor: user.uid === this.state.activeChatRoom &&
          "#ffffff45",
          cursor: 'pointer'
        }}
        onClick={() => this.changeChatRoom(user)}>
        # {user.name}
      </li>
    ))

  render() {
    // 현재 존재하는 사용자 리스트 (state)
    const { users } = this.state;
    return (
      <div>
        <span style={{ display:'flex', alignItems:'center' }}>
          <FaRegSmile style={{ marginRight: 3 }}/> DIRECT MESSAGES({users.length})
        </span>

        <ul style={{ listStyleType: 'none', padding: 0}}>
          {this.renderDirectMessages(users)}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
    user: state.user.currentUser,
  }
}

export default connect(mapStateToProps)(DirectMessages)