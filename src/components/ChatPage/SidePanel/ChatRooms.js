// 클래스 컴포넌트
import React, { Component } from 'react'
// 아이콘
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
// Modal, Button, Forms Bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export class ChatRooms extends Component {
  // 클래스컴포넌트의 state 선언 방식
  state = {
    show: false
  }

  handleClose = () => this.setState({ show: false});
  handleShow = () => this.setState({ show: true });

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
            <Form>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>방 이름</Form.Label>
                <Form.Control type="text" placeholder="Enter a chat room name" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>방 설명</Form.Label>
                <Form.Control type="text" placeholder="Enter a chat room description" />
              </Form.Group>

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default ChatRooms