import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// react-router-dom 호출
import { BrowserRouter } from 'react-router-dom';

// Provider 호출 (Redux)
import { Provider } from 'react-redux';

// 스토어, 미들웨어 호출
import { legacy_createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';

// 리듀서 호출
import Reducer from './redux/reducers'

// React Bootstrap 호출
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// 미들웨어 설정
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(legacy_createStore);

root.render(
  <React.StrictMode>
    <Provider store={createStoreWithMiddleware(
      Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    )}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);