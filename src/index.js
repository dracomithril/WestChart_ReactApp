import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import "./index.css";
import reducers from "./reducers";


const combined = combineReducers(reducers);
ReactDOM.render(
    <Provider store={createStore(combined)}>
        <App />
    </Provider>,
    document.getElementById('root')
);
