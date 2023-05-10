// 클래스 컴포넌트
import React, { Component } from 'react'
// 아이콘
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
// Modal, Button, Forms Bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// 현재 사용자 state을 가져오기 위한 redux/connect 선언
// Functional Component는 useSeletor로 가져오지만, Class Component는
// connect로 가져온다.
import { connect } from 'react-redux';
// firebase
import firebase from "../../../firebase";
// redux action 호출
import { setCurrentChatRoom } from '../../../redux/actions/chatRoom_action';

export class ChatRooms extends Component {
  // 클래스컴포넌트의 state 선언 방식
  state = {
    show: false, // Modal 제어 state
    name: "", // 방 생성 제어 state
    description: "", // 방 생성 제어 state
    chatRoomsRef: firebase.database().ref("chatRooms"), // 채팅 룸에 대한 ref
    chatRooms: [], // 채팅방 리스트
    firstLoad: true, // 채팅방 리스트를 최초로 불러왔을 경우 판단
    activeChatRoomId: "",// 각 채팅방의 ID
  }

  // 해당 함수는 ChatRooms 컴포넌트 호출 시 실행된다.
  // ex) submit 시 render() 실행
  componentDidMount(){
    // 컴포넌트 호출 시 해당 Chat Rooms 출력
    this.AddChatRoomsListeners();
  }

  // 해당 함수는 ChatRooms가 파괴되었을 때 실행된다.
  // ChatRooms 컴포넌트는 최초 실행 시 파이어베이스에서 Listener를 통하여
  // 계속해서 데이터를 주고받는다. 컴포넌트가 필요하지 않을때는 이를 제한한다.
  componentWillUnmount(){
    // .off()를 통하여 Listener를 off 시키면 더 이상 데이터가 전달되지 않는다.
    this.state.chatRoomsRef.off();
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
    });
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
    // 선택된 채팅방 active
    this.setState({ activeChatRoomId: room.id });
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
          # {room.name}
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
  }
}

export default connect(mapStateToProps)(ChatRooms)