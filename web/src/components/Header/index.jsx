/**
 * Created by Gryzli on 25.01.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'react-bootstrap';
import CookieBanner from 'react-cookie-banner';
import UserInfo from './UserInfo';
import './Header.css';

import action_types from './../../reducers/action_types';

export default class Header extends React.Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onLogoutClick = () => {
    const { store } = this.context;
    store.dispatch({ type: action_types.SIGN_OUT_USER });
    sessionStorage.removeItem('fb_user');
    sessionStorage.removeItem('sp_user');
    window.location = '/';
  };

  render() {
    const { store } = this.context;
    const { user, sp_user } = store.getState();
    return (
      <div className="wcs_header">
        <CookieBanner
          message={
            "Yes, we use cookies. If you don't like it change website, we won't miss you! ;)"
          }
          onAccept={() => {}}
          cookie="user-has-accepted-cookies"
        />

        <PageHeader bsClass="title-header">Music Helper</PageHeader>
        {user.name && (
          <UserInfo fb_user={user} sp_user={sp_user} onLogoutClick={this.onLogoutClick} />
        )}
      </div>
    );
  }
}
Header.contextTypes = {
  store: PropTypes.object,
};
Header.propTypes = {};
