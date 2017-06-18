import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {routerReducer, syncHistoryWithStore} from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import Header from "./components/Header";

import {combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import "./index.css";
import reducers from "./reducers/reducers";
const {Route, Router} = require('react-router');


const store = createStore(
    combineReducers({
        ...reducers,
        routing: routerReducer
    })
);

const history = syncHistoryWithStore(createHistory(), store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <div>
                <Header/>
                <Route path="/" component={App}/>
            </div>
        </Router>
    </Provider>
    ,
    document.getElementById('root')
);
