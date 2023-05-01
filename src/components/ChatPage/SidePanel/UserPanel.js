import React from 'react'
// icon 사용을 위한 react-icons 임포트
import { IoIosChatboxes } from 'react-icons/io';
// DropDown을 사용하기 위한 Boot strap 사용
import Dropdown from 'react-bootstrap/Dropdown';
// 프로필 이미지설정을 위한 Boot strap 사용
import { Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function UserPanel() {
    // redux store에서 유저 정보 가져오기
    const user = useSelector(state => state.user.currentUser);

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
                    <Dropdown.Item>
                        로그아웃
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    </div>
  )
}

export default UserPanel