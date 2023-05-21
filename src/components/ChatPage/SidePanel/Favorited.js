import React, { Component } from 'react'
import { FaRegSmileBeam } from 'react-icons/fa'
// firebase
import firebase from '../../../firebase';
// redux
import { connect } from 'react-redux';
// redux action 호출
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';

export class Favorited extends Component {

  state = {
    usersRef: firebase.database().ref("users"),
    favoritedChatRoom: [], // 즐겨찾기 채팅방 리스트
    activeChatRoomId: "", // 채팅방 선택(active) 판별
  }

  componentWillUnmount(){
    // 사용자가 존재할 때
    if(this.props.user){
      this.removeFavoriteListener(this.props.user.uid);
    }
  }

  // 즐겨찾기 추가/제거 리스너 off
  removeFavoriteListener = (userId) => {
    this.state.usersRef.child(`${userId}/favorited`).off();
  }

  componentDidMount(){
    // 사용자가 존재할 때만
    if(this.props.user){
      // 즐겨찾기 채팅방 추가 (현재 사용자 id 전달)
      this.addFavoriteListeners(this.props.user.uid);
    }
  }

  // 즐겨찾기 한 채팅방 가져오기
  addFavoriteListeners = (userId) => {
    const { usersRef } = this.state;

    // 사용자가 즐겨찾기 추가했을 때 아래의 리스너 실행
    usersRef
      .child(userId)
      .child("favorited")
      .on("child_added", DataSnapshot => { // DataSnapshot : 채팅방 정보
         const favoritedChatRoom = { id: DataSnapshot.key, ...DataSnapshot.val() }
         this.setState({
          // 즐겨찾기 채팅방 리스트에 추가
          favoritedChatRoom: [...this.state.favoritedChatRoom, favoritedChatRoom]
         })
      });
      
    // 사용자가 즐겨찾기 해제했을 때 아래의 리스너 실행
    usersRef
      .child(userId)
      .child("favorited")
      .on("child_removed", DataSnapshot => {
        // 즐겨찾기가 제거된 채팅방 정보 불러오기 
        const chatRoomToRemove = { id: DataSnapshot.key, ...DataSnapshot.val()};
        const filteredChatRooms = this.state.favoritedChatRoom.filter(chatRoom => {
          return chatRoom.id !== chatRoomToRemove.id;
        });
        this.setState({ favoritedChatRoom: filteredChatRooms })
      });
  }

  // 채팅방 선택 (active)
  // 클릭한 채팅방 정보 redux에 업로드
  changeChatRoom = (room) => {
    // Class Component에서는 this.props.dispatch()의 형식으로 redux 업로드
    this.props.dispatch(setCurrentChatRoom(room));
    // 해당 채팅방은 private가 아니다. 즉, public(공개) 채팅방 명시
    this.props.dispatch(setPrivateChatRoom(false));
    // 선택된 채팅방 active
    this.setState({ activeChatRoomId: room.id });
    // 만약, 해당 채팅방에 알람이 있을 때 채팅방 입장 시 알람 초기화
  }

  // 즐겨찾기 채팅방 리스트 render
  renderFavoritedChatRooms = (favoritedChatRoom) =>
    favoritedChatRoom.length > 0 &&
    favoritedChatRoom.map(chatRoom => (
      <li 
        key={chatRoom.id} 
        onClick={() => this.changeChatRoom(chatRoom)}
        style={{
          backgroundColor: chatRoom.id === this.state.activeChatRoomId && "#ffffff45"
        }}
      >
        # {chatRoom.name}
      </li>
    ))

  render() {
    const { favoritedChatRoom } = this.state;
    return (
      <div>
        <span style={{ display: 'flex', alignItems: 'center'}}>
          <FaRegSmileBeam style={{ marginRight: '3px' }}/>
          FAVORITED ({favoritedChatRoom.length})
        </span>
        <ul style={{ listStyleType: 'none', padding: 0}}>
          {this.renderFavoritedChatRooms(favoritedChatRoom)}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
    user: state.user.currentUser
  }
}

export default connect(mapStateToProps)(Favorited);