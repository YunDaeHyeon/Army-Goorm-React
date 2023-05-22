import React, { useEffect, useState } from 'react';
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
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
// firebase
import firebase from '../../../firebase';

function MessageHeader({handleSearchChange}) {
  // 방 리스트 불러오기 (공개, public)
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  // 비공개(DM), 공개(오픈 채팅방) 판별 state 불러오기
  const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom);
  // 현재 접속중인 사용자 가져오기
  const user = useSelector(state => state.user.currentUser);
  // 즐겨찾기 방 state
  const [isFavorited, setIsFavorited] = useState(false);
  // firebase database 접근
  const usersRef = firebase.database().ref("users");

  useEffect(() => {
    if(chatRoom && user){
      addFavoriteListener(user.uid, chatRoom.id);
    }
  }, []);

  // 새로고침 할때 즐겨찾기 불러오기
  const addFavoriteListener = (userId, chatRoomId) => {
    usersRef
      .child(userId)
      .child("favorited")
      .once("value") // firebase에서 단 한번만 가져온다.
      .then(data => {
        // 만약 응답된 데이터가 null면 사용자가 즐겨찾기한 방이 없다는 것.
        if(data.val() !== null){ // 즐겨찾기한 방이 존재하면
          // 응답된 객체에서 value 추출
          const chatRoomIds = Object.keys(data.val());
          // 이미 해당 채팅방이 즐겨찾기인지 판별한다.
          // 즉, chatRoomIds에 데이터가 존재한다면 즐겨찾기 한 채팅방
          // 결론 : 새로고침 했는데 해당 채팅방이 즐겨찾기한 상태면
          // isAlreayFavorited는 true
          const isAlreadyFavorited = chatRoomIds.includes(chatRoomId)
          setIsFavorited(isAlreadyFavorited);
        }
      })
  }

  // 즐겨찾기 방 설정
  const handleFavorite = () => { 
    // 해당 채팅방이 즐겨찾기 활성화 -> 비활성화라면 정보 제거
    if(isFavorited){
      usersRef
        .child(`${user.uid}/favorited`)
        .child(chatRoom.id)
        .remove(error => {
          // 에러 발생 시
          if(error !== null){
            console.log("즐겨찾기 오류", error);
          }
        });
      // state 갱신
      setIsFavorited(prev => !prev);
    }else{ // 해당 채팅방이 비활성화 -> 활성화라면 정보 추가
      usersRef
        .child(`${user.uid}/favorited`).update({
          [chatRoom.id]: {
            name: chatRoom.name,
            description: chatRoom.description,
            createBy: {
              name: chatRoom.createBy.name,
              image: chatRoom.createBy.image
            }
          }
        })
      // state 갱신
      setIsFavorited(prev => !prev);
    }
  }

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
            {chatRoom && chatRoom.name}
            { // public 채팅방일 경우
              !isPrivateChatRoom &&
              <span style = {{ cursor: 'pointer'}} onClick={handleFavorite}>
                { // 즐겨찾기 방(초기값 : false)이라면
                isFavorited ?
                <MdFavorite style={{ marginBottom: '10px'}}/> 
                : 
                <MdFavoriteBorder style={{ marginBottom: '10px'}}/>
                }
              </span>
            }</h2></Col>
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
            <Image
              src={chatRoom && chatRoom.createBy.image}
              roundedCircle style={{ width: '30px', height: '30px'}}
            />{" "}{chatRoom && chatRoom.createBy.name}
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start'}}>
          <p>
            {chatRoom && chatRoom.description}{" "}
          </p>
        </div>
      </Container>
    </div>
  )
}

export default MessageHeader