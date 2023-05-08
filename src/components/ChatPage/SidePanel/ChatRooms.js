// 클래스 컴포넌트
import React, { Component } from 'react'
// 아이콘
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
// Modal, Button Bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

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

          <FaPlus style={{
            position: 'absolute',
            right: 0, cursor: 'pointer'
          }}/>

        </div>

        {/* 채팅방 Modal*/}
        <Button variant='primary' onClick={this.handleShow}>
          Launch demo modal
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>reading this text in a modal!</Modal.Body>
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