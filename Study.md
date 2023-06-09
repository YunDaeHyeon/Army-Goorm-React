# SW개발 고급과정(JS)
 : 2023-04-26 ~ ing  

# Redux란?
 : **가장 많이 사용하는 리액트 상태 관리 라이브러리**  
 : **컴포넌트의 상태 업데이트 관련 로직을 *다른 파일*로 분리시켜 더욱 효율적으로 관리할 수 있다.**  
 : **!!또한 여러 컴포넌트를 거치지 않고 원하는 상태값을 전달하거나 업데이트 할 수 있다.**  
 
**? 무조건 리덕스를 사용하는게 좋은가?**  
무조건 리덕스를 사용하는 것이 유일한 해결책은 아님.  
 : **Context API**를 사용하여 똑같은 작업을 수행할 수 있음.  
 : 단순히 전역 상태 관리만 한다면 **Context API**를 통하여 똑같은 작업을 수행할 수 있음.  
 : **프로젝트의 규모가 클 경우에는 리덕스를 사용하는 것이 좋다.
 : ** 그 이유는 체계적으로 상태를 관리할 수 있으며 **코드 유지 보수성을 높여주며 작업 효율도 극대화해준다.**  

 ## Redux : 액션(Action)
 : 상태에 어떠한 변화가 필요하면 액션(action)이 발생하며 이는 하나의 **객체**로 표현된다.  
 : { type : 'TOGGLE_VALUE' }  
 : 액션 객체는 **TYPE** 필드를 반드시 가지고 있어야하며 이는 액션의 **이름**이다.  
  
버스비 왕복 4
서울시내 교통비 0.5
롯데월드(티켓 + 간식 + 기타) 5
컨버스 7
식비 3

20.5 <- 만약 하루 자고간다?


```JavaScript
{
    type : 'ADD_TODO'
    data : {
        id : 1, 
        text : '리덕스 배우기'
    }
}
```

## Redux : 액션 생성 함수(Action Creator)
 : 액션 생성 함수(Action Creator)는 액션 객체를 만들어 주는 함수이다.

```JavaScript
function addTodo(data){
    return{
        type: 'ADD_TODO',
        data
    }
}

const changeInput = text => ({
    type: 'CHANGE_INPUT',
    text
})
```
 : 어떠한 변화를 일으켜야 할 때마다 **액션 객체를 만들어야 한다.**  
 : 매번 액션 객체를 생성하기엔 번거롭기에 이를 **함수로 만들어서 사용한다.**  

## Redux : 리듀서(Reducer)
 : 리듀서(Reducer)는 상태(State)에 변화를 일으키는 함수.
 : 액션을 만들어서 발생시킨다면 **리듀서가 현재 상태와 전달받은 액션 객체를 파라미터로 받아온다.**  
 : 그 후 두 값을 참고하여 **새로운 상태를 만들어서 반환한다.**  

```JavaScript
const initialState = {
    counter : 1
};

// first @param : 이전 값, second @param : 액션 객체
function reducer(state = initialState, action){
    switch(action.type){ // 액션 객체의 타입에 따라서
        case INCERMENT : 
            return {
                counter : state.counter + 1;
            };
        default:
            return state; // 새로운 상태를 반환
    }
}
```

## Redux : 스토어(Store)
 : 프로젝트에 리덕스를 적용하기 위해서 **스토어(Store)**를 만든다.  
 : 스토어(Store)는 **한 개의 프로젝트에 단 하나만 존재한다.**  
 : 스토어 안에는 현재 애플리케이션 상태와 리듀서가 존재한다.  
 : 그 외에 몇 가지 중요한 내장 함수가 존재하며 **state를 수시로 확인해 *View*에게 변경된 사항을 전달한다.**  

## Redux : 디스패치(Dispatch)
 : 디스패치(dispatch)는 **스토어의 내장 함수 중 하나.**  
 : **'액션을 발생시키는 것'**이며 해당 함수는 `dispatch(action)`와 같은 형태로 액션 객체를 파라미터로 넣어서 호출한다.  
 : 디스패치가 액션을 발생시켜 스토어에게 상태 변화가 필요하다는 것을 알린다.  
 : 해당 함수가 호출되면 **스토어는 리듀서 함수를 실행시켜 새로운 상태를 만든다.**  

## Redux : 구독(Subscribe)
 : 스토어의 내장 함수 중 하나이며 subscribe 함수 안에 **리스너 함수를 파라미터로 넣어 호출하면 해당 함수가 **디스패치되어 상태가 업데이트 될 때마다 호출된다.**  

```JavaScript
const listener = () => {
    console.log("상태가 업데이트 됨.");
}

const unscribe = store.subscribe(listener);

unscribe();
```

## Redux : 최종 흐름
1. Action Creator가 Action 객체를 생성  
2. 생성된 Action의 Dispatch가 호출되면 Store가 Reducer 함수 호출  
3. 새로운 상태 생성  

# CSS Framework 종류(for ReactJS)
1. Material UI  
2. React Bootstrap  
3. Semantic UI  
4. Ant Design  
5. Materialize  
  
! 해당 프로젝트에는 React BootStrap, React Icons를 사용하였음.  

# react-hook-form
 : 입력창의 유효성 검사를 효율적으로 진행하기 위해 해당 라이브러리 사용.  
 
# md5
 : 프로필 이미지를 업로드 할 때 파라미터를 유니크한 값으로 명시하기 위해 사용.  

# Firebase의 realtimeDatabase 사용법
```SQL
# MySQL의 경우
INSERT INTO users(email, displayName, photoURL) VALUES
(kayuaao12@naver.com, kayuaao12, gravatar...)

# MongoDB의 경우
UserModel.create({ 
    email : "kayuaao12@naver.com",
    displayName : "kayuaao12",
    photoURL: "gravatar"
})

# FireBase
firebase.database().ref("users")
    .child(userId)
    .set({
        name : displayName,
        image: photoURL
    })
```
!! 즉, MySQL에서 테이블, 도메인, 컬럼들이 FireBase에서는 각각
ref(Reference), child, set으로 변경.  
!! 이때, ref의 파라미터로는 경로가 지정될 수 있다. 만약, 명시하지 않을 시 
DB 루트에 데이터가 저장된다.  

# BrowserRouter이 있는 파일에 useNavigate 사용 시 오류나는 이유
 : BrowserRouter를 App.js가 아닌 더 상위에 올려야한다.  
 : index.js에서 변경.  

# 로그인 한 유저의 정보를 어디에서나 사용할 수 있도록.
 : redux 스토어에 저장.  
  
!! Redux Data Save Flow(strict unidirectional data flow)
ACTION -> REDUCER -> STORE -> SUBSCRIBE -> React Component -> Dispatch(action) 
-> ACTION ... 반복   

# 협업 연습을 위한 git 커밋컨벤션 사용
!: Feat - 새로운 기능을 추가할 경우  
!: Fix - 버그를 고친 경우  
!: Design - CSS 등 사용자 UI 디자인 변경  
!: !BREAKING CHANGE - 커다란 API 변경의 경우  
!: !HOTFIX - 급하게 치명적인 버그를 고쳐야하는 경우  
!: Style - 코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우  
!: Refactor - 프로덕션 코드 리팩토링  
!: Comment - 필요한 주석 추가 및 변경  
!: Docs - 문서를 수정한 경우  
!: Test	- 테스트 추가, 테스트 리팩토링(프로덕션 코드 변경 X)  
!: Chore - 빌드 태스트 업데이트, 패키지 매니저를 설정하는 경우(프로덕션 코드 변경 X)  
!: Rename - 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우  
!: Remove - 파일을 삭제하는 작업만 수행한 경우  

# 프로필 이미지 수정
만약, Firebase가 아닌 `Node`를 사용한 경우는 이미지를 업로드 시킬 때 `Multer` 라이브러리를 사용하여 하드디스크에 이미지를 처리 후 DB에 업로드시킨 뒤 가져오는 형식을 취한다.  
  
! Firebase의 경우는 React에서 이미지를 `Firebase Storage`에 업로드 한 뒤 `Firebase DB`에 저장한다. (이때, Storage와 DB는 다른 서비스임을 유의.)  

# mime-types 모듈 적용
 : 업로드된 파일의 타입을 확인하기 위하여 해당 모듈을 설치한다.  
  
# 검색으로 메시지 찾기(1) : regrex(정규식 생성)
```javaScript
const regex = new RegExp(this.state.searchTerm, "gi");
```
`RegExp` 생성자는 패턴을 사용하여 **텍스트를 판별할 때** 사용한다. 즉, 정규 표현식을 생성한다. 이를 이용하여 원하는 문자열이 포함되어있는 데이터를 검색한다.  
  
`RegExp`의 func에는 두 가지의 인자가 존재한다.  
첫 번째 인자 : 검색하고자 하는 문자열  
두 번째 인자 : 검색 방법 (옵션)
 -> 옵션의 경우 
 1. `g` modifier : **global**. All matches (don't return on first math). 즉, "안녕하세요" 입력 시 그와 관련된 모든 데이터를 반환한다.  
 2. `i` modifier : **insensitive**. Case insensitive math (ignores case of [a-zA-Z]). 즉, **대소문자**를 가리지 않고 모두 검색하여 반환한다.  
  
# 검색으로 메시지 찾기(2) : reduce (생성된 정규식 판별)
? 관련 링크 : [mozila](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

# 검색으로 메시지 찾기(3) : match
 : `match()`는 특정 텍스트 안에 검색할 단어, 찾고싶은 단어가 있는 경우 해당 텍스트가 문구에 포함되어 있는지 확인할 수 있다.  
 또한 `정규표현식`을 사용하여 특정 패턴을 검색하는 것 또한 가능하다.  
  
**`해당 문자열.match('찾을 단어')`**  
**-> `match()`함수는 인자에 포함된 문자를 찾으면 이를 반환.**  

# 검색으로 메시지 찾기(4) : 최종 코드 해석
  
```javaScript
// Class Component 기준
handleSearchMessages = () => {
    const chatRoomMessages = [...this.state.messages];
    // regex에 RegExp로 제작한 정규식을 저장. (사용자가 검색하고자 한 데이터를 정규식으로 전환)
    const regex = new RegExp(this.state.SearchTerm, "gi");
    // searchResults에 reduce를 이용하여 regex(정규식)을 판별한다.
    // 첫 번째 인자 : acc(accumulator, 누산기). callback 의 반환값을 누적시킨다.
    // 두 번째 인자 : currentValue. 현재 요소를 말한다.
    // 세 번째 인자 : initialValue. acc(누산기)의 초기값을 지정한다.
    // 이때, 초기값(initialValue)을 제공하지 않으면 배열의 첫 번째 요소를 초기값으로 사용한다. 이때, 빈 배열에서 초기값 없이 reduce()를 호출하면 오류가 발생한다.
    // reduce 함수의 최종 반환 값은 누적 계산값의 결과 값이다.
    const searchResults = chatRoomMessages.reduce((acc, message) => {
        if(
            // 메시지 내용이 사용자가 검색한 내용(정규식)과 사용자 이름이 매치되면
            (message.content && message.content.match(regex)) ||
            message.user.name.match(regex)
        ){  // 누산기에 매치된 내용을 계속 push 한다.
            acc.push(message);
        }
        // 축적된 내용을 반환한다.
        return acc;
        // 초기값은 빈 배열이다.
    }, []);
    // 최종 값을 state에 저장하여 화면에 검색된 내용을 뿌린다.
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false}), 1000);
}
```