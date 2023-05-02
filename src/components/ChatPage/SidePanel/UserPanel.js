import React, { useRef } from 'react'
// icon 사용을 위한 react-icons 임포트
import { IoIosChatboxes } from 'react-icons/io';
// DropDown을 사용하기 위한 Boot strap 사용
import Dropdown from 'react-bootstrap/Dropdown';
// 프로필 이미지설정을 위한 Boot strap 사용
import { Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
// firebase
import firebase from '../../../firebase';
// mime-types 호출
import mime from "mime-types";

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

    // 사진(파일) 선택을 위한 ref
    const inputOpenImageRef = useRef();

    // 프로필 사진 변경 클릭 시
    const handleOpenImageRef = () => {
        // 해당 ref가 속한 element를 실행(클릭)
        inputOpenImageRef.current.click();
    }

    // 프로필 사진 파이어베이스 스토리지 버킷으로 추가
    const handleUploadImage = async (event) => {
        // 선택한 파일 불러오기
        const file = event.target.files[0];

        // 선택한 파일의 메타데이터 불러오기
        const metadata = {contentType: mime.lookup(file.name)};

        // 파일을 스토리지 버킷으로 추가
        try{
            // 파일 저장하기
            let uploadTaskSnapshot = await firebase.storage().ref()
                // 스토리지 내부에 user_image라는 폴더 내부에 저장
                .child(`user_image/${user.uid}`)
                // @first param : upload file, @second param : upload file metadata
                .put(file, metadata)

        }catch(error){

        }
        console.log("file", file);
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
                    <Dropdown.Item onClick={handleOpenImageRef}>
                        프로필 사진 변경
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                        로그아웃
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>

            {/* 프로필 이미지 수정(파일) 선택 */}
        <input
        onChange={handleUploadImage}
            accept='image/jpeg, image/png'
            type="file"
            ref={inputOpenImageRef}
            style={{ display: "none"}}
           />
    </div>
  )
}

export default UserPanel