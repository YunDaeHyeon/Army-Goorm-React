# 2023년 국군 SW 개발  
플랫폼 : 구름 EDU  
개발기간 : 2023-03-29 ~ 2023-05-24  
수정 기간 : 23-05-24 ~ ing
  
## 추가해야할 것 
1. DM(Direct Message)의 `온/오프라인` 식별 기능 추가  

## 수정해야할 것
1. 최초 사이트 접속 시 render 실패 이슈(새로고침 시 접속 성공)  
2. 각 채팅방 알람이 카운트되지 않는 이슈  
3. 로딩이 끝난 직후 메시지가 존재하지 않는 채팅방의 `스켈레톤 애니메이션`이 종료되지 않는 이슈  
4. 권한 별 컴포넌트 접근 권한을 부여할 때 최초 접속 시 `회원가입 페이지` 접근 불가 이슈  

# 프로젝트 Dependencys
**`클라이언트`**  
1. react, react-dom  
2. react-router-dom  
3. react-hook-form  
4. md5  
5. mime-types  
6. moment  
7. react-bootstrap  
8. react-icons  
  
**`상태 관리`**  
1. redux  
2. react-redux, redux-promise, redux-thunk  

**`데이터베이스`**  
`firebase` 기반 `Realtime Database`, `Storage`  
  
**`인증`**  
`firebase` 기반 `Authentication`  

# 프로젝트 구조
```console
├── App.js
├── commons
│   └── components
│       ├── Skeleton.css
│       └── Skeleton.js
├── components
│   ├── ChatPage
│   │   ├── ChatPage.js
│   │   ├── MainPanel
│   │   │   ├── MainPanel.js
│   │   │   ├── Message.js
│   │   │   ├── MessageForm.js
│   │   │   ├── MessageForm_style.css
│   │   │   └── MessageHeader.js
│   │   └── SidePanel
│   │       ├── ChatRooms.js
│   │       ├── DirectMessages.js
│   │       ├── Favorited.js
│   │       ├── SidePanel.js
│   │       └── UserPanel.js
│   ├── LoginPage
│   │   ├── LoginPage.js
│   │   └── LoginPage_style.css
│   └── RegisterPage
│       ├── RegisterPage.js
│       └── RegisterPage_style.css
├── firebase.js
├── index.js
└── redux
    ├── actions
    │   ├── chatRoom_action.js
    │   ├── types.js
    │   └── user_action.js
    └── reducers
        ├── chatRoom_reducer.js
        ├── index.js
        └── user_reducer.js
```

# 실행 화면
## 로그인
![로그인](https://github.com/YunDaeHyeon/WorkBee/assets/62231651/1edc86f1-b279-463b-9662-7031ad966a6c)

## 회원가입
![회원가입](https://github.com/YunDaeHyeon/WorkBee/assets/62231651/629458d0-34ee-4618-8e37-c5b7a855c48e)  
  
## 채팅
![채팅화면 1](https://github.com/YunDaeHyeon/WorkBee/assets/62231651/686fb80b-ab90-4ddb-8f7a-aba20837ef34)  
  
## 프로필 변경
![프로필 변경](https://github.com/YunDaeHyeon/WorkBee/assets/62231651/258cce9f-d0fd-4485-83a6-f4aa0ee09d85)  
  
## 즐겨찾기 & 검색
![즐겨찾기_검색_테스트](https://github.com/YunDaeHyeon/WorkBee/assets/62231651/48e54d48-0b2a-4d3f-b16c-52d2862dbcbe)  
  
## 다이렉트 메세지
![다이렉트메시지](https://github.com/YunDaeHyeon/WorkBee/assets/62231651/3d18e2f5-a657-4939-9a20-bcacd95eecb6)  
  