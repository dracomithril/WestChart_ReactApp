import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {routerReducer} from "react-router-redux";
import {combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import "./index.css";
import reducers from "./reducers/reducers";
import {BrowserRouter as Router} from "react-router-dom";

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }));

ReactDOM.render(<Provider store={store}>
    <Router>
      <App/>
    </Router>
  </Provider>,
  document.getElementById('root')
);