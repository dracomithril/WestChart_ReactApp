import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Combiner from "./components/PlaylistCombiner"
import {routerReducer, syncHistoryWithStore} from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import Header from "./components/Header";
import ErrorConsole from "./components/ErrorConsole";
import {combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import "./index.css";
import reducers from "./reducers/reducers";
import PropTypes from "prop-types";

const {Route, Router, Redirect, Switch} = require('react-router');

const isAuthenticated = true;
const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => (
        isAuthenticated ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: {from: props.location}
            }}/>
        )
    )}/>
);
PrivateRoute.contextTypes = {
    store: PropTypes.object
};
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
                <ErrorConsole/>
                <Switch>
                    <Route path="/chart" component={App}/>
                    {/*<Route path="/login" component={LoginAlert}/>*/}
                    {/*<PrivateRoute path="/protected" component={App}/>*/}
                    <Route path={"/combiner"} exact component={Combiner}/>
                    <Route path={"/api/spotify/callback"} component={(props)=>{
                        console.log(props);
                    }} />
                    <Redirect to="/chart"/>

                </Switch>
            </div>
        </Router>
    </Provider>
,
document.getElementById('root')
);
