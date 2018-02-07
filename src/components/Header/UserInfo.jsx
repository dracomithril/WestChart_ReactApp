/**
 * Created by Gryzli on 07.04.2017.
 */
import React from "react";
import PropTypes from 'prop-types';
import {Button, Image, Well} from "react-bootstrap";

const { writeUserData } = require('./../../utils');
const action_types = require('./../../reducers/action_types');

export default class UserInfo extends React.Component {
  /*istanbul ignore next*/
  componentDidMount() {
    console.log('component UserInfo did mount');
    const { store } = this.context;
    let { user, sp_user } = store.getState();
    if (user.id && sp_user.id) {
      writeUserData(user, sp_user)
    }

  }

  logoutUser = () => {
    const { store } = this.context;
    store.dispatch({ type: action_types.SIGN_OUT_USER });
    sessionStorage.removeItem('fb_user');
    sessionStorage.removeItem('sp_user');
  };

  /*istanbul ignore next*/
  componentWillUnmount() {
    console.log('component UserInfo unmounted');
  }

  render() {
    const { store } = this.context;
    let { user, sp_user } = store.getState();
    return (
      <Well bsClass="logged">
        <div>
          <Image src={user.picture_url} circle/>
          <span>{`Hi, ${user.first_name}`}</span><br/>
          <span>{`it's nice to see you again.`}</span><br/>
          {sp_user.id !== undefined &&
          <div className="spotify">
            <i className="fa fa-spotify"/>
            <span>{sp_user.id}</span>
          </div>}
          <div style={{ textAlign: "center" }}>
            <Button bsStyle="warning" onClick={this.logoutUser}>Sign out</Button>
          </div>
        </div>
      </Well>);
  }
}
UserInfo.contextTypes = {
  store: PropTypes.object
};

UserInfo.propTypes = {};