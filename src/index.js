import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Combiner from "./components/PlaylistCombiner"
import {Nav, NavItem} from "react-bootstrap";
import {routerReducer, syncHistoryWithStore} from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import LoginAlert from "./components/LoginAlert"
import Header from "./components/Header";
import ErrorConsole from "./components/ErrorConsole";
import {combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import "./index.css";
import reducers from "./reducers/reducers";
import PropTypes from "prop-types";

const { Route, Router, Redirect, Switch } = require('react-router');

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
);


class PrivateRoute extends React.Component {
  render() {
    const { component: Component, ...rest } = this.props;
    const { store } = this.context;
    const { location } = this.props;
    const { user, sp_user } = store.getState();
    const isAuthenticated = !!user.id && !!sp_user.id;
    return (
      <Route {...rest} render={props => (
        isAuthenticated ? (
          <Component {...props}/>
        ) : (
          <Redirect to={'/login'} from={location.pathname}/>
        )
      )}/>
    )
  }
}

PrivateRoute.contextTypes = {
  store: PropTypes.object
};


const history = syncHistoryWithStore(createHistory(), store);

function About() {
  return <h2>Hi That will be introduction</h2>;
}

const pathnames = ["/", "/chart", "/combiner"];

class Navigation extends React.Component {
  get ActiveKey() {
    const activeKey = pathnames.indexOf(window.location.pathname);
    return activeKey !== -1 ? activeKey : 0;
  }

  render() {
    return <div>
      <Nav bsStyle={"tabs"}>
        <NavItem eventKey={0} href="/">
          Info
        </NavItem>
        <NavItem eventKey={1} href="/chart">
          Chart
        </NavItem>
        <NavItem eventKey={2} href="/combiner">
          Combiner(BETA)
        </NavItem>
      </Nav>
      <Switch>
        <Route exact path="/" component={About}/>
        <PrivateRoute path="/chart" exact component={App}/>
        <PrivateRoute path={"/combiner"} exact component={Combiner}/>
        <Route path="/login" component={LoginAlert}/>
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
