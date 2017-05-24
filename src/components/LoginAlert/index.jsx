/**
 * Created by Gryzli on 28.01.2017.
 */
import React from "react";
import PropTypes from 'prop-types';
import {Button, Jumbotron} from "react-bootstrap";
import FacebookLogin from "react-facebook-login";
import "./LoginAlert.css";
const notGroupAdmin = "Sorry you are not admin of this group.";
import {loginToSpotify} from './../../spotify_utils';

export default class LoginAlert extends React.Component {
    /*istanbul ignore next*/
    componentDidMount() {
        console.log('component LoginAlert did mount');
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
            <p>{user.isGroupAdmin ? '' : notGroupAdmin}</p>

            {user.id === undefined && <FacebookLogin
                appId={process.env.NODE_ENV === 'production' ? "1173483302721639" : "1173486879387948"}
                language="pl_PL"
                autoLoad={true}
                scope="public_profile,email,user_managed_groups"
                callback={(response) => store.dispatch({type: 'UPDATE_USER',response:response})}
                fields="id,email,name,first_name,picture,groups{administrator}"
                cssClass="btn btn-social btn-facebook"
                icon={"fa fa-facebook"}
                version="v2.8"
            />}
            {sp_user.id === undefined &&
            <Button className="btn btn-social btn-spotify" onClick={loginToSpotify}><i className="fa fa-spotify"/>Login to
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