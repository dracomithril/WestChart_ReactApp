/**
 * Created by Gryzli on 28.01.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Button, Jumbotron} from "react-bootstrap";
import FacebookLogin from "react-facebook-login";
import "./LoginAlert.css";
// const notGroupAdmin = "Sorry you are not admin of this group.";
import {loginToSpotify, setATInterval, validateCredentials} from "./../../spotify_utils";
const action_types = require('./../../reducers/action_types');
const spotify_login_uri = '/api/spotify/login_r';

export default class LoginAlert extends React.Component {
    /*istanbul ignore next*/
    componentDidMount() {
        const {store} = this.context;
        const state = store.getState();
        const {hasAcCookie} = state;
        console.log('component LoginAlert did mount');
        if (!hasAcCookie) {
            loginToSpotify().then(validateCredentials).then((res) => {
                store.dispatch({
                    type: action_types.UPDATE_SP_USER,
                    user: res.user,
                    access_token: res.access_token
                });
            }).catch((e) => console.warn(e));
        }
    }

    /*istanbul ignore next*/
    componentWillUnmount() {
        console.log('component LoginAlert unmounted');
    }

    render() {
        const {store} = this.context;
        const {user, sp_user} = store.getState();
        let url;
        if (process.env.NODE_ENV === 'production') {
            url = spotify_login_uri;
        } else {
            url = `http://localhost:3001${spotify_login_uri}`
        }
        return (<Jumbotron bsClass="login-info">
            <h4>{'To start working witch us you need to login to facebook and spotify.'}<i className="fa fa-heart"/>
            </h4>
            {/*<p>{user.isGroupAdmin===true||user.isGroupAdmin===undefined ? '' : notGroupAdmin}</p>*/}

            {user.id === undefined && <FacebookLogin
                appId={process.env.NODE_ENV === 'production' ? "1173483302721639" : "1173486879387948"}
                language="pl_PL"
                autoLoad={true}
                scope={"public_profile,email,user_managed_groups"}
                callback={(response) => store.dispatch({type: 'UPDATE_USER', response: response})}
                fields={"id,email,name,first_name,picture,groups{administrator}"}
                cssClass="btn btn-social btn-facebook"
                icon={"fa fa-facebook"}
            />}
            {sp_user.id === undefined &&
            <Button className="btn btn-social btn-spotify" onClick={() => {
                window.open(url, '_blank', "width=780,height=410,toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0");
                setATInterval().then(validateCredentials).then(res => {
                    store.dispatch({
                        type: action_types.UPDATE_SP_USER,
                        user: res.user,
                        access_token: res.access_token
                    });
                });
            }}>
                <i className="fa fa-spotify"/>Login to spotify
            </Button>}
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