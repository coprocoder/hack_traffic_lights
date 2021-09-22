import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux';

// Мои модули
import App from './app'
import reducer from './redux/reducer';

// Хранилище redux
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
var store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render((
    <BrowserRouter>
      <Provider store={store}>
          <App/>
      </Provider>
    </BrowserRouter>
),document.getElementById('root'))
