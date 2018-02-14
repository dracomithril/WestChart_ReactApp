/**
 * Created by Gryzli on 28.01.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Button, Jumbotron } from 'react-bootstrap';
import FacebookLogin from 'react-facebook-login';
import './LoginAlert.css';
import { getCredentials, loginToSpotifyAlpha } from './../../spotify_utils';

const action_types = require('./../../reducers/action_types');

const SpotifyLogin = props => (
  <Button
    className="btn btn-social btn-spotify"
    onClick={() => {
      loginToSpotifyAlpha()
        .then(() => {
          // window.location = path;
          props.onUpdate && props.onUpdate();
          window.location = props.from || '/';
        })
        .catch(err => {
          console.error(err.message);
        });
    }}
  >
    <i className="fa fa-spotify" />Login to spotify
  </Button>
);
SpotifyLogin.propTypes = {
  onUpdate: PropTypes.func,
  from: PropTypes.string,
};

class LoginAlert extends React.Component {
  componentWillMount() {
    const { store } = this.context;
    getCredentials()
      .then(({ user, access_token }) => {
        store.dispatch({
          type: action_types.UPDATE_SP_USER,
          user,
          access_token,
        });
      })
      .catch(err => {
        console.error(err.message);
      });
  }

  render() {
    const { location } = this.props;
    const { store } = this.context;
    const { user, sp_user } = store.getState();
    const { from } = location.state || { from: { pathname: '/' } };
    if (user.id && sp_user.id) {
      return <Redirect to={from} />;
    }
    return (
      <Jumbotron bsClass="login-info">
        <h4>
          {'To start working witch us you need to login to facebook and spotify.'}
          <i className="fa fa-heart" />
        </h4>
        {user.id === undefined && (
          <FacebookLogin
            appId={process.env.NODE_ENV === 'production' ? '1173483302721639' : '1173486879387948'}
            language="pl_PL"
            autoLoad
            scope="public_profile,email,user_managed_groups"
            callback={response => {
              store.dispatch({ type: action_types.UPDATE_USER, response });
            }}
            fields={'id,email,name,first_name,picture,groups{administrator}'}
            cssClass="btn btn-social btn-facebook"
            icon="fa fa-facebook"
          />
        )}
        {sp_user.id === undefined && <SpotifyLogin from={from} />}
      </Jumbotron>
    );
  }
}

LoginAlert.contextTypes = {
  store: PropTypes.object,
};
LoginAlert.propTypes = {
  location: PropTypes.object,
};
export default LoginAlert;
