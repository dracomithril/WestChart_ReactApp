/**
 * Created by Gryzli on 07.04.2017.
 */
import React from "react";
import PropTypes from 'prop-types';
import {Button, Image, Well} from "react-bootstrap";
//TODO save information about user to database, do it somewhere else
// const { writeUserData } = require('./../../utils');

export default class UserInfo extends React.Component {

  render() {
    const { fb_user, sp_user, onLogoutClick } = this.props;
    return (
      <Well bsClass="logged">
        <div>
          <Image src={fb_user.picture_url} circle/>
          <span>{`Hi, ${fb_user.first_name}`}</span><br/>
          <span>{`it's nice to see you again.`}</span><br/>
          {sp_user.id !== undefined &&
          <div className="spotify">
            <i className="fa fa-spotify"/>
            <span>{sp_user.id}</span>
          </div>}
          <div style={{ textAlign: "center" }}>
            <Button bsStyle="warning" onClick={() => {onLogoutClick();}}>Sign out</Button>
          </div>
        </div>
      </Well>);
  }
}
UserInfo.contextTypes = {
  store: PropTypes.object
};

UserInfo.propTypes = {
  fb_user: PropTypes.object,
  sp_user: PropTypes.object,
  onLogoutClick: PropTypes.func,
};