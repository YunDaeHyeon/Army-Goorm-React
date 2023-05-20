import React from 'react';
// BootStrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
// react-redux
import { useSelector } from 'react-redux';
// Icon
import { FaLock, FaLockOpen } from 'react-icons/fa'
import { MdFavorite } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';

function MessageHeader({handleSearchChange}) {
  // 방 리스트 불러오기 (공개, public)
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  // 비공개(DM), 공개(오픈 채팅방) 판별 state 불러오기
  const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom);


  return (
    <div style={{
      width: '100%',
      height: '170px',
      border: '.2rem solid #ececec',
      borderRadius: '4px',
      padding: '1rem',
      marginBottom: '1rem'
    }}>
      <Container>
        <Row>
          <Col><h2>
            { // public room이라면 해제된 자물쇠,
              // private room이라면 자물쇠
              isPrivateChatRoom ?
              <FaLock style={{ marginBottom: '10px' }}/> : 
              <FaLockOpen style={{ marginBottom: '10px' }}/>
            }
            {chatRoom && chatRoom.name} <MdFavorite/></h2></Col>
          <Col>
            <InputGroup className='md-3'>
                <InputGroup.Text id="basic-addon1"><AiOutlineSearch/></InputGroup.Text>
              <FormControl
                onChange={handleSearchChange}
                placeholder='Search Messages'
                aria-label='Search'
                aria-describedby='basic-addon1'
              />
            </InputGroup>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
          <p>
            <Image/>{" "}user name
          </p>
        </div>
        <Row>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: '0 1rem'}}>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Click me!
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: '0 1rem'}}>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Click me!
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default MessageHeader