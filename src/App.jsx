import React, {Component} from "react";
import PropTypes from "prop-types";
import ChartPresenter from "./components/ChartPresenter";
import "./App.css";
import "react-table/react-table.css";
import "react-datepicker/dist/react-datepicker.css";
import ErrorConsole from "./components/ErrorConsole";
import {Redirect, Route} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Combiner from "./components/PlaylistCombiner";
import LoginAlert from "./components/LoginAlert";
import {Nav, NavItem} from "react-bootstrap";

const { validateCredentials } = require("./spotify_utils");
const { cookies_name } = require('./utils');
const action_types = require('./reducers/action_types');
const Cookies = require('cookies-js');

const pathways = ["/", "/chart", "/combiner"];


class PrivateRoute extends React.Component {
  render() {
    const { component: Component, ...rest } = this.props;
    const { store } = this.context;
    const { user, sp_user } = store.getState();
    const isAuthenticated = !!user.id && !!sp_user.id;
    return (
      <Route {...rest} render={props => (
        isAuthenticated ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }}/>
        )
      )}/>)
  }
}

PrivateRoute.contextTypes = {
  store: PropTypes.object
};


const About = () => (<div>
  <h2>Hi That will be introduction</h2>
  <h3 style={{ color: "red" }}>Creation in progress</h3>
  <h4 style={{ color: "gray" }}>Nothing is true everything is permitted</h4>
</div>);

const Navigation = () => (<div>
  <Nav bsStyle={"tabs"} activeKey={(() => {
    return pathways.indexOf(window.location.pathname);
  })()}>
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
  <Route exact path="/" component={About}/>
  <Route path="/login" component={LoginAlert}/>
  <PrivateRoute path="/chart" exact component={ChartPresenter}/>
  <PrivateRoute path={"/combiner"} exact component={Combiner}/>
</div>);

class App extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillMount() {
    console.log('will mount App');
    const { store } = this.context;
    const sp_user_ac = Cookies.get(cookies_name.access_token);
    if (sp_user_ac) {
      store.dispatch({ type: action_types.TOGGLE_HAS_COOKIE, value: true });
      validateCredentials(sp_user_ac).then(res => {
        store.dispatch({
          type: action_types.UPDATE_SP_USER,
          user: res.user,
          access_token: res.access_token
        });

      });
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <ErrorConsole/>
        <Navigation/>
        <Footer/>
      </div>
    );
  }
}

App.contextTypes = {
  store: PropTypes.object
};
export default App;
