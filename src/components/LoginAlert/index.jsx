/**
 * Created by Gryzli on 28.01.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Button, Jumbotron} from "react-bootstrap";
import FacebookLogin from "react-facebook-login";
import "./LoginAlert.css";
// const notGroupAdmin = "Sorry you are not admin of this group.";
import {loginToSpotify, validateCredentials} from "./../../spotify_utils";
// const {loginToSpotify, validateCredentials} = require("./spotify_utils");
const action_types = require('./../../reducers/action_types');
const {cookies_name} = require('./../../utils');
const Cookies = require('cookies-js');
const querystring = require('querystring');

export default class LoginAlert extends React.Component {
    /*istanbul ignore next*/
    componentDidMount() {
        const {store} = this.context;
        const state = store.getState();
        const {hasAcCookie} = state;
        console.log('component LoginAlert did mount');

        const setCookies = function (access_token, refresh_token) {
            Cookies.set('wcs_sp_user_ac', access_token, {
                expires: 3600
            });
            Cookies.set(cookies_name.refresh_token, refresh_token);
        };
        let update_user = function (res) {
            store.dispatch({
                type: action_types.UPDATE_SP_USER,
                user: res.user,
                access_token: res.access_token
            });
        };
        const {location, history} = this.props;
        const {pathname, search} = location;
        if (pathname.includes('/user')) {
            const query = querystring.parse(search.substr(1, search.length));
            validateCredentials(query.access_token).then(res => {
                setCookies(query.access_token, query.access_token);
                update_user(res);
                history.push('')
            });
        } else if (hasAcCookie) {
            console.log('we have cookie');
        } else {
            loginToSpotify();
        }
    }

    /*istanbul ignore next*/
    componentWillUnmount() {
        console.log('component LoginAlert unmounted');
    }

    render() {
        const {store} = this.context;
        const {user, sp_user} = store.getState();
        return (<Jumbotron bsClass="login-info">
            <h4>{'To start working witch us you need to login to facebook and spotify.'}<i className="fa fa-heart"/>
            </h4>
            {/*<p>{user.isGroupAdmin===true||user.isGroupAdmin===undefined ? '' : notGroupAdmin}</p>*/}

            {user.id === undefined && <FacebookLogin
                appId={process.env.NODE_ENV === 'production' ? "1173483302721639" : "1173486879387948"}
                language="pl_PL"
                autoLoad={true}
                scope="public_profile,email,user_managed_groups"
                callback={(response) => store.dispatch({type: 'UPDATE_USER', response: response})}
                fields="id,email,name,first_name,picture,groups{administrator}"
                cssClass="btn btn-social btn-facebook"
                icon={"fa fa-facebook"}
                version="v2.8"
            />}
            {sp_user.id === undefined &&
            <Button className="btn btn-social btn-spotify" onClick={loginToSpotify}><i className="fa fa-spotify"/>Login
                to
                spotify</Button>}
        </Jumbotron>)
    }
}
LoginAlert.contextTypes = {
    store: PropTypes.object
};
LoginAlert.propTypes = {
    loginUser: PropTypes.func,
    alertMessage: PropTypes.string
};