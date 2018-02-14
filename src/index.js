import React from 'react';
import ReactDOM from 'react-dom';
import { routerReducer } from 'react-router-redux';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import reducers from './reducers/reducers';

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer,
  }),
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
