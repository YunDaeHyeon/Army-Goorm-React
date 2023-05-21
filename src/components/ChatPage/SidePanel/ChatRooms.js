// 클래스 컴포넌트
import React, { Component } from 'react'
// 아이콘
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
// Modal, Button, Forms Bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
// 현재 사용자 state을 가져오기 위한 redux/connect 선언
// Functional Component는 useSeletor로 가져오지만, Class Component는
// connect로 가져온다.
import { connect } from 'react-redux';
// firebase
import firebase from "../../../firebase";
// redux action 호출
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';

export class ChatRooms extends Component {
  // 클래스컴포넌트의 state 선언 방식
  state = {
    show: false, // Modal 제어 state
    name: "", // 방 생성 제어 state
    description: "", // 방 생성 제어 state
    chatRoomsRef: firebase.database().ref("chatRooms"), // 채팅 룸에 대한 ref
    messagesRef: firebase.database().ref("messages"), // 메시지에 대한 ref
    chatRooms: [], // 채팅방 리스트
    firstLoad: true, // 채팅방 리스트를 최초로 불러왔을 경우 판단
    activeChatRoomId: "",// 각 채팅방의 ID
    notifications: [], // 각 채팅방의 알람 수
  }

  // 해당 함수는 ChatRooms 컴포넌트 호출 시 실행된다.
  // ex) submit 시 render() 실행
  componentDidMount(){
    // 컴포넌트 호출 시 해당 Chat Rooms 출력
    this.AddChatRoomsListeners();
  }

  // 해당 함수는 ChatRooms Component가 파괴되었을 때 실행된다.
  // ChatRooms 컴포넌트는 최초 실행 시 파이어베이스에서 Listener를 통하여
  // 계속해서 데이터를 주고받는다. 컴포넌트가 필요하지 않을때는 이를 제한한다.
  componentWillUnmount(){
    // .off()를 통하여 Listener를 off 시키면 더 이상 데이터가 전달되지 않는다.
    this.state.chatRoomsRef.off();
    // 각 채팅방들에 대한 message 리스너 off
    this.state.chatRooms.forEach(chatRoom => {
      this.state.messagesRef.child(chatRoom.id).off();
    });
  }

  // 만약, 최초로 새로고침이 발생했을 경우 임의적으로 첫 번째 채팅방을 state에 저장한다.
  setFirstChatRoom = () => {
    const firstChatRoom = this.state.chatRooms[0];
    // 만약, 최초로 새로고침을 진행했으며 채팅방이 하나 이상 존재한다면
    if(this.state.firstLoad && this.state.chatRooms.length > 0){
      // redux 업로드 진행
      this.props.dispatch(setCurrentChatRoom(firstChatRoom));
      // 첫 번째 채팅방 active
      this.setState({ activeChatRoomId: firstChatRoom.id })
    }
    // 최초로 새로고침을 진행하였으면 firstLoad를 false로 바꾼다.
    // 이유는, 첫 번째 채팅방을 임의적으로 딱 한번만 명시하면 되기 때문.
    this.setState({ firstLoad: false });
  }

  AddChatRoomsListeners = () => {
    let chatRoomsArray = [];

    // chatRoomsRef에 데이터가 변경되는 점을 계속해서 읽어온다.
    // 즉, 파이어베이스에 저장된 데이터를 실시간으로 읽어온다.
    // !! 다른 사람이 저장한 데이터도 실시간으로 불러온다는 의미 !!
    this.state.chatRoomsRef.on("child_added", DataSnapshot => {
        // 해당 DataSnapshot props로 실시간으로 읽어온 데이터를 불러온다.
        chatRoomsArray.push(DataSnapshot.val());
        // 불러온 데이터 state 적용
        this.setState({ chatRooms: chatRoomsArray}, 
          () => this.setFirstChatRoom());
        // DataSnapshot.key는 chatRoomId이다.
        // 각 채팅방 알람 수 생성 (각 채팅방에 들어오는 메시지의 수 가져오기)
        this.addNotificationListener(DataSnapshot.key);
    });
  }

  // 각 채팅방 알람 수 가져오기 (Notification)
  addNotificationListener = (chatRoomId) => {
    // firebase에 존재하는 메시지들에게 특정 채팅방 ID에 대한 정보 가져오기
    // "value"에 대한 설명 : https://firebase.google.com/docs/database/admin/retrieve-data?hl=ko#node.js
    // 해당 child에 데이터가 추가될 때마다 해당 리스너 호출
    this.state.messagesRef.child(chatRoomId).on("value", DataSnapshot => {
      // Datasnapshot -> message의 collection 모음
      if(this.props.chatRoom){ // 현재 redux에 chatRoom이 존재하면
        this.handleNotification( // 알람 핸들링 함수
          chatRoomId,
          this.props.chatRoom.id,
          this.state.notifications,
          DataSnapshot
        )
      }
    })
  }

  // 알람 핸들링 함수
  /*
    첫 번째 param : 각 채팅방의 Id (순서대로, 현재 방 ID 아님)
    두 번째 param : 현재 접속한 채팅방의 ID
    세 번째 param : state에 존재하는 각 알람들의 모음 (배열)
    네 번째 param : 리스너를 통해 불러와진 데이터들 (메시지가 추가된 방)
  */
  handleNotification = (chatRoomId, currentChatRoomId, notifications, DataSnapshot) => {
    // 1. 이미 notifications state 안에 알람 정보가 들어있는 채팅방인지 아닌지 구분

    // notifications에 존재하는 모든 index를 탐색
    // notification : 배열에 존재하는 각각의 데이터들
    // findIndex()와 같은 것이 없다면 -1 반환
    // index에 -1이 반환되었다면 해당 notifications state 내부에는 특정된 채팅방이 존재하지 않음.
    let index = notifications.findIndex(notification =>
      notification.id === chatRoomId) // notifications state 특정 index에 각 채팅방의 ID 지정
    
    // notification state 안에 해당 채팅방의 알림 정보가 없을 때(즉, 새로 만든 채팅방일 경우)
    if(index === -1){
      // 알람 정보가 없을 때(새로 만들어진 채팅방)
      // 채팅방 하나 하나에 맞는 알림 정보 생성
      notifications.push({
        id: chatRoomId, // 채팅방 아이디 지정
        total: DataSnapshot.numChildren(), // 해당 채팅방 전체 메시지 개수
        lastKnownTotal: DataSnapshot.numChildren(), // 이전에 확인한 전체 메시지 개수
        count: 0, // 알림으로 사용할 숫자
        // !! DataSnapshot.numChildren() : 전체 children 개수 (= 전체 메시지 개수)
      })
    }else{ // 이미 해당 채팅방 정보가 존재할 때
      // 상대방이 채팅을 보내는 해당 채팅방에 있지 않을 때
      // 같은 채팅방에 상주하면 알람을 지정할 필요 X
      if(chatRoomId !== currentChatRoomId){
        // 현재까지 사용자가 확인한 총 메시지 개수
        let lastTotal = notifications[index].lastKnownTotal;

        // 알림으로 사용할 숫자 지정 (count)
        // 현재 총 메시지 개수 - 이전에 확인한 총 메시지 개수 > 0
        // 현재 총 메시지 개수가 10, 이전에 확인한 메시지 개수가 8이면 알림은 2개
        if(DataSnapshot.numChildren() - lastTotal > 0){
          // 총 메시지 개수(numChildren()) - 확인한 메시지 개수(lastTotal) = 알람 개수(count)
          notifications[index].count = DataSnapshot.numChildren() - lastTotal;
        }
      }
      // total property에 현재 전체 메시지 개수 지정
      notifications[index].total = DataSnapshot.numChildren();
    }
    // 각각의 방에게 맞는 알람 정보를 notifications state에 넣어주기
    this.setState({ notifications });
  }

  // 방 생성 Modal 열기
  handleShow = () => this.setState({ show: true });
  // 방 생성 Modal 닫기
  handleClose = () => this.setState({ show: false});
  // 방 생성 핸들
  handleSubmit = (e) => {
    e.preventDefault(); // submit 방지
    const { name, description } = this.state;

    // 유효성 체크 (해당 Form에 방 제목과 방 설명이 존재하면 true)
    if(this.isFormValid(name, description)) {
      this.addChatRoom();
    }
  }

  // 방 생성 시 유효성 체크
  isFormValid = (name, description) => name && description;

  // 클릭한 채팅방 정보 redux에 업로드
  changeChatRoom = (room) => {
    // Class Component에서는 this.props.dispatch()의 형식으로 redux 업로드
    this.props.dispatch(setCurrentChatRoom(room));
    // 해당 채팅방은 private가 아니다. 즉, public(공개) 채팅방 명시
    this.props.dispatch(setPrivateChatRoom(false));
    // 선택된 채팅방 active
    this.setState({ activeChatRoomId: room.id });
    // 만약, 해당 채팅방에 알람이 있을 때 채팅방 입장 시 알람 초기화
    this.clearNotifications();
  }

  // 채팅방 입장 시 알람 초기화
  clearNotifications = () => {
    // 만약, 알람이 없으면 findIndex는 -1을 반환
    // notification.id : 알람을 알고자 하는 채팅방 ID
    // this.props.chatRoom.id : 현재 접속한 채팅방 ID
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.props.chatRoom.id
    )

    // 해당 채팅방에 notifications 에 대한 값이 들어있다면 (알람이 있다면)
    if(index !== -1){
      // 알람 메시지 수 갱신을 위한 새로운 변수 선언
      let updatedNotifications = [...this.state.notifications];
      // 이전에 확인한 메시지 개수 갱신
      // index : 위에서 notifications state에서 가져온 특정 채팅방 알람 정보
      updatedNotifications[index].lastKnownTotal = this.state.notifications[index].total;
      // 알람 수 초기화
      updatedNotifications[index].count = 0;
      // state 갱신
      this.setState({ notifications: updatedNotifications });
    }
  }

  // 각 채팅방 알람 개수 가져오기
  // param : 해당 채팅방에 대한 정보
  getNotificationCount = (room) => {
    let count = 0;
    // notifications state에 존재하는 모든 value 탐색
    this.state.notifications.forEach(notification => {
      // 알람이 존재하는 id와 현재 채팅방 id가 일치하면
      if(notification.id === room.id){
        count = notification.count;
      }
    })
    // 알람이 1개 이상이면 반환 (그렇지 않으면 알람 X)
    if(count > 0) return 1;
  } 

  // 채팅방 리스트 렌더링
  renderChatRooms = (chatRooms) =>
      // 만약, chatRooms가 0보다 크면 (즉, 채팅방이 1개 이상 있으면)
      chatRooms.length > 0 && chatRooms.map(room => (
        <li 
          key={room.id}
          style={{ 
            // 특정 채팅방 클릭시(active) 배경색 변경
            backgroundColor: room.id === this.state.activeChatRoomId &&
            "#ffffff45",
            cursor: 'pointer'
          }}
          onClick={() => this.changeChatRoom(room) /* 클릭한 채팅방 정보 redux 저장 */}
        >
          # {room.name} : {this.getNotificationCount(room)}
        </li>
      ));

  // 생성되는 방의 정보 구성
  addChatRoom = async () => {
    /* 방의 ID (Primary Key 역할)
    이때, this.state.chatRoomsRef.push().key;의 경우
    push()를 수행했을 때 auto-generated key가 생성된다.
    해당 키는 현재 TimeStamp를 근거로 생성되어 시간순으로 배열된다.
    push()로 생성된 키를 불러오기 위해 .key 를 사용한다.
    */
   const key = this.state.chatRoomsRef.push().key;
    // 방의 이름과 설명
    const { name, description } = this.state;
    // 현재 로그인되어있는 사용자 state
    const { user } = this.props;
    // 생성되는 Chat Rooms의 ID(PK), 이름, 설명, 생성자 정보를 명시한다.
    const newChatRoom = {
      id: key,
      name: name,
      description: description,
      createBy: {
        name: user.displayName,
        image: user.photoURL
      }
    }

    // 해당 방 정보를 firebase로 전달
    try{
      // ChatRooms라는 테이블에 key라는 이름이 ID(PK)인 채팅방(newChatRoom)을 생성
      await this.state.chatRoomsRef.child(key).update(newChatRoom);
      // 전달 성공 시 state 초기화
      this.setState({
        name: "",
        description: "",
        show: false,
      })
    }catch(error){
      alert(error);
    }
  }

  render() {
    return (
      <div>
        <div style={{
          position: 'relative', width:'100%',
          display: 'flex', alignItems: 'center'
        }}>
          <FaRegSmileWink style={{ marginRight: 3 }}/>
          CHAT ROOMS {" "} ({this.state.chatRooms.length})
          <FaPlus 
            onClick={this.handleShow}
            style={{
              position: 'absolute',
              right: 0, cursor: 'pointer'
            }}/>

        </div>

        <ul style={{ listStyleType: 'none', padding: 0}}>
          {this.renderChatRooms(this.state.chatRooms)}
        </ul> 

        {/* 채팅방 Modal*/}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create a chat room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>방 이름</Form.Label>
                <Form.Control 
                  onChange={(e) => this.setState({ name: e.target.value })}
                  type="text" 
                  placeholder="Enter a chat room name" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>방 설명</Form.Label>
                <Form.Control 
                  onChange={(e) => this.setState({ description: e.target.value })}
                  type="text"
                  placeholder="Enter a chat room description" />
              </Form.Group>

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.handleClose}>
              닫기
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              방 생성
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

// redux 스토어에 들어있는 state를 해당 컴포넌트에서 사용할 수 있는
// props로 변환한다. * connect()
const mapStateToProps = (state) => {
  return{
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom
  }
}

export default connect(mapStateToProps)(ChatRooms)