import React from 'react'
// BootStrap
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
// CSS
import "./MessageForm_style.css";

function MessageForm() {
  return (
    <div>
      <Form>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
      </Form>
      <ProgressBar variant="warning" label="60%" now={60}/>
      <Row>
        <Col>
          <button
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