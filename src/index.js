import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Combiner from "./components/PlaylistCombiner"
import {Nav, NavItem} from "react-bootstrap";
import {routerMiddleware, routerReducer, syncHistoryWithStore} from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import LoginAlert from "./components/LoginAlert"
import Header from "./components/Header";
import ErrorConsole from "./components/ErrorConsole";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import "./index.css";
import reducers from "./reducers/reducers";
import PropTypes from "prop-types";
import {Route, Router, Switch} from 'react-router';

const middleware = routerMiddleware(createHistory);

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }, applyMiddleware(middleware))
);
const history = syncHistoryWithStore(createHistory(), store);

class PrivateRoute extends React.Component {
  render() {
    const { component: Component, ...rest } = this.props;
    const { location } = this.props;
    const { store } = this.context;
    const { user, sp_user } = store.getState();
    const isAuthenticated = !!user.id && !!sp_user.id;
    if (isAuthenticated) {
      return (
        <Route {...rest} render={props => (
          <Component {...props}/>
        )}/>)
    } else {

      return null;
    }
  }
}

PrivateRoute.contextTypes = {
  store: PropTypes.object
};


function About() {
  return <div>
    <h2>Hi That will be introduction</h2>
    <h3 style={{ color: "red" }}>Creation in progress</h3>
    <h4 style={{ color: "gray" }}>Nothing is true everything is permitted</h4>
  </div>;
}

const pathnames = ["/", "/chart", "/combiner", "/login"];

class Navigation extends React.Component {
  get ActiveKey() {
    const activeKey = pathnames.indexOf(window.location.pathname);
    return activeKey !== -1 ? activeKey : 0;
  }

  render() {
    const { store } = this.context;
    const { user, sp_user } = store.getState();
    const isAuthenticated = !!user.id && !!sp_user.id;
    return <div>
      <Nav bsStyle={"tabs"} activeKey={this.ActiveKey}>
        <NavItem eventKey={0} href="/">
          Info
        </NavItem>

        <NavItem eventKey={1} href="/chart">
          Chart
        </NavItem>
        <NavItem eventKey={2} href="/combiner">
          Combiner(BETA)
        </NavItem>
        <NavItem eventKey={3} href="/login" disabled={isAuthenticated} style={{display:!isAuthenticated?'block':'none'}}>
          Login
        </NavItem>
      </Nav>
      <Switch>
        <Route exact path="/" component={About}/>
        <Route path="/login" component={LoginAlert}/>
        <PrivateRoute path="/chart" exact component={App}/>
        <PrivateRoute path={"/combiner"} exact component={Combiner}/>
      </Switch>
    </div>;
  }
}

Navigation.contextTypes = {
  store: PropTypes.object
};

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Header/>
        <ErrorConsole/>
        <Navigation/>
      </div>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
