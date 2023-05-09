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

export class ChatRooms extends Component {
  // 클래스컴포넌트의 state 선언 방식
  state = {
    show: false, // Modal 제어 state
    name: "", // 방 생성 제어 state
    description: "", // 방 생성 제어 state
    chatRoomsRef: firebase.database().ref("chatRooms"), // 채팅 룸에 대한 ref
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
          CHAT ROOMS {" "} (1)
          <FaPlus 
            onClick={this.handleShow}
            style={{
              position: 'absolute',
              right: 0, cursor: 'pointer'
            }}/>

        </div>

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