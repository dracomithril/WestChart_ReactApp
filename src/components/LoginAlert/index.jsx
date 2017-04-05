/**
 * Created by Gryzli on 28.01.2017.
 */
import React, {PropTypes} from "react";
import {Alert} from "react-bootstrap";
import FacebookLogin from "react-facebook-login";
import "./LoginAlert.css";
const loginMsg = "Login to facebook to be able to do something cool";
const notGroupAdmin = "Sorry you are not admin of this group.";
const groupId = '1707149242852457';
let map_user = (response) => {
    let isGroupAdmin = response.groups.data.filter((elem) => elem.id === groupId && elem.administrator === true);
    return {
        accessToken: response.accessToken,
        email: response.email,
        first_name: response.first_name,
        expiresIn: response.expiresIn,
        id: response.id,
        name: response.name,
        signedRequest: response.signedRequest,
        userID: response.userID,
        picture_url: response.picture.data.url,
        isGroupAdmin: isGroupAdmin
    };
};
export default class LoginAlert extends React.Component {
    render() {
        const {store} = this.context;
        const state = store.getState();
        return (<Alert bsClass="login-alert">
            <h4>Oh snap! You got an error!</h4>
            <p>{state.user === undefined ? loginMsg : (!state.user.isGroupAdmin ? notGroupAdmin : '')}</p>
            <FacebookLogin
                appId={process.env.NODE_ENV === 'production' ? "1173483302721639" : "1173486879387948"}
                language="pl_PL"
                autoLoad={true}
                scope="public_profile,email,user_managed_groups"
                callback={(response) => {
                    store.dispatch({type: 'UPDATE_USER', user: map_user(response)})
                }}
                fields="id,email,name,first_name,picture,groups{administrator}"
                cssClass="btn btn-social btn-facebook"
                icon={"fa fa-facebook"}
                version="v2.8"
            />
        </Alert>)
    }
}
LoginAlert.contextTypes = {
    store: PropTypes.object
};
LoginAlert.propTypes = {
    loginUser: PropTypes.func,
    alertMessage: PropTypes.string
};