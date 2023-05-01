import React from 'react'
// icon 사용을 위한 react-icons 임포트
import { IoIosChatboxes } from 'react-icons/io';
// DropDown을 사용하기 위한 Boot strap 사용
import Dropdown from 'react-bootstrap/Dropdown';
// 프로필 이미지설정을 위한 Boot strap 사용
import { Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
// firebase
import firebase from '../../../firebase';

/* !! 주의사항
    firebase.auth().signOut()으로 로그아웃을 진행하면
    파이어베이스 서비스에서 로그아웃 되는 것.
    즉, 리덕스 스토어에는 유저 정보가 남아있기에
    리덕스 스토어에 잔류하는 상태 또한 제거해야함.
*/

function UserPanel() {
    // redux store에서 유저 정보 가져오기
    const user = useSelector(state => state.user.currentUser);

    // Firebase Logout and Redux store data delete
    const handleLogout = () => {
        firebase.auth().signOut();
    }

  return (
    <div>
        {/* 아이콘 로고 */}
        <h3 style={{ color:'white'}}>
            <IoIosChatboxes/>{" "} Chat App
        </h3>

        {/* 프로필 이미지 Dropdown */}
        <div style={{display: 'flex', marginBotton: '1rem'}}>
            <Image 
                src={user && user.photoURL /* user state가 존재한다면*/}
                style={{ 
                    width: '30px', 
                    height: '30px', 
                    marginTop: '3px',
                    marginRight: '5px'
                }}
                roundedCircle
            />

            <Dropdown>
                <Dropdown.Toggle
                 id='dropdown-basic'
                 style={{background: 'transparent', border: '0px'}}
                 >
                    {user && user.displayName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>
                        프로필 사진 변경
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                        로그아웃
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    </div>
  )
}

export default UserPanel