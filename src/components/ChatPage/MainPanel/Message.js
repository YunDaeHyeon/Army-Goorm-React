import React from 'react';
// React Bootstrap
import Card from 'react-bootstrap/Card';
// timeStamp 커스텀
import moment from 'moment';

function Message({ message , user }) {
  
  // moment 호출
  const timeFromNow = timeStamp => moment(timeStamp).fromNow();

  const isImage = message => {
    // !! hasOwnProperty : 객체가 특정 프로퍼티를 가지고 있는지 판단
    // 즉, image는 가지고 있는데 content는 아니면 true -> is image
    // content는 가지고 있지만 image를 가지고 있지 않으면 false -> is not image
    
    return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
  }

  // 자신이 직접 보낸 메시지는 background를 회색으로 표시
  const isMessageMine = (message, user) => {
    // message는 화면에 보여지는 메시지의 정보
    // user는 현재 접속중인 사용자의 정보
    return message.user.id === user.uid;
  }

  return (
    <Card style={{ marginBottom: '3px'}}>
      <img
        style={{ borderRadius: '10px'}}
        width={48}
        height={48}
        className='mr-3'
        src={message.user.image}
        alt={message.user.name}
      />
      <Card.Body style={{ 
        // 만약, 자신의 메시지가 맞다면 회색처리
        backgroundColor: isMessageMine(message, user) &&
        "#ECECEC" }}>
        <h6>{message.user.name}{" "}
          <span style={{ fontSize: '10px', color: 'gray' }}>
            {timeFromNow(message.timeStamp)}
          </span>
        </h6>
        {
        isImage(message) ? // 이미지, 문자열 판별
          <img style={{ maxWidth: '300px' }} alt="이미지" src={message.image}/>
          : <p>{message.content}</p>
        }
      </Card.Body>
    </Card>
  )
}

export default Message;