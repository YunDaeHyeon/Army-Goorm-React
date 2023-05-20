import React, { Component } from 'react'
// react-icons
import { FaRegSmile } from 'react-icons/fa';
// firebase
import firebase from '../../../firebase';
// redux
import { connect } from 'react-redux';

export class DirectMessages extends Component {

  state = { 
    // 파이어베이스 DB 접근 (users 테이블)
    usersRef : firebase.database().ref("users"),
    // 현재 접속중인 사용자 리스트
    users: [],

  }

  componentDidMount(){
    // 현재 사용자가 존재할 때
    if(this.props.user){
      this.addUsersListeners(this.props.user.uid);
    }
  }

  // 사용자 목록 불러오기
  addUsersListeners = (currentUserId) => {
    const { usersRef } = this.state;
    let usersArray = [];
    // 사용자 정보가 DB에 추가될 때 마다 불러오기
    usersRef.on("child_added", Datasnapshot => {
      // 자기 자신은 제외한 모든 사용자 리스트 불러오기
      // .key는 해당 child의 PK를 의미 (즉, user의 id)
      if(currentUserId !== Datasnapshot.key){
        // 불러온 데이터의 값을 저장
        let user = Datasnapshot.val();
        user["uid"] = Datasnapshot.key; // 불러온 데이터의 PK 저장
        user["status"] = "offline"; // 해당 사용자가 접속중인지 판별
        usersArray.push(user);
        this.setState({ users: usersArray });
      }
    });
  }

  renderDirectMessages = () => {

  }

  render() {
    console.log("users", this.state.users);
    return (
      <div>
        <span style={{ display:'flex', alignItems:'center' }}>
          <FaRegSmile style={{ marginRight: 3 }}/> DIRECT MESSAGES(1)
        </span>

        <ul style={{ listStyleType: 'none', padding: 0}}>
          {this.renderDirectMessages()}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
    user: state.user.currentUser,
  }
}

export default connect(mapStateToProps)(DirectMessages)