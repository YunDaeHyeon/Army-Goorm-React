import React, {useState} from 'react'
// BootStrap
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
// firebase
import firebase from '../../../firebase';
// Redux
import { useSelector } from 'react-redux';
// CSS
import "./MessageForm_style.css";

function MessageForm() {
  // redux에 존재하는 채팅방 리스트 불러오기
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  // redux에 존재하는 사용자 리스트 불러오기
  const user = useSelector(state => state.user.currentUser);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = firebase.database().ref("messages");

  const handleChange = (event) => {
    setContent(event.target.value);
  }

  // 메시지 생성 (넘어온 파라미터(fileUrl)이 존재하지 않다면 null)
  const createMessage = (fileUrl = null) => {
    const message = {
      timeStamp : firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL
      }
    }
    // 사용자가 입력한 메시지가 단순 문자열인지, 이미지 업로드인지
    if(fileUrl !== null){ // fileUrl이 존재한다는 것은 이미지 업로드
      message["image"] = fileUrl;
    }else{ // fireUrl이 존재하지 않다는 것은 단순 문자열
      message["content"] = content;
    }
    return message; // message 반환
  }

  const handleSubmit = async () => {
    // 보내기 (SEND) 클릭 시
    if(!content){ // 입력한 사항이 없는 경우 error
      // 기존에 존재한 error state에 추가로 더하기
      setErrors(prev => prev.concat("Type contents first"));
      return;
    }
    setLoading(true); // 로딩완료
    // firebase에 메시지를 저장
    try{
      await messagesRef
        .child(chatRoom.id)
        .push()
        .set(createMessage())
      // 에러가 없으면 저장 성공. 따라서 관련된 state 변환
      setLoading(false);
      setContent("");
      setErrors([]);
    }catch(error){
      setErrors(prev => prev.concat(error.message));
      setLoading(false);
      // 5초뒤 에러 문구 삭제
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  }
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control 
            value={content}
            onChange={handleChange}
            as="textarea" 
            rows={3} />
        </Form.Group>
      </Form>
      <ProgressBar variant="warning" label="60%" now={60}/>
      <div>
        {errors.map(errorMessage => 
          <p style={{ color: 'red' }} key={errorMessage}>
            {errorMessage}
          </p>)
        }
      </div>
      <Row>
        <Col>
          <button
            onClick={handleSubmit}
            className='message-form-button'
            style={{ width: '100%'}}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
            className='message-form-button'
            style={{ width: '100%'}}
          >
            UPLOAD
          </button>
        </Col>
      </Row>
    </div>
  )
}

export default MessageForm