import React, {Component} from "react";
import PropTypes from "prop-types";
import Footer from "./components/Footer";
import ChartPresenter from "./components/ChartPresenter";
import "./App.css";
import "react-table/react-table.css";
import "react-datepicker/dist/react-datepicker.css";

const { validateCredentials } = require("./spotify_utils");
const { cookies_name } = require('./utils');
const action_types = require('./reducers/action_types');
const Cookies = require('cookies-js');

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
        <ChartPresenter/>
        <Footer/>
      </div>
    );
  }
}

App.contextTypes = {
  store: PropTypes.object
};
export default App;
