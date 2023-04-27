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

const changeInput = text - > ({
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
 