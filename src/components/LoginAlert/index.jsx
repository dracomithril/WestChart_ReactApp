/**
 * Created by Gryzli on 28.01.2017.
 */
import React from 'react';
import {Alert} from 'react-bootstrap';
import FacebookLogin from 'react-facebook-login';
import './LoginAlert.css';

export default class LoginAlert extends React.Component {
    render() {
        const prod_app_id = "1173483302721639";
        const test_app_id = "1173486879387948";
        return (<Alert bsClass="login-alert">
            <h4>Oh snap! You got an error!</h4>
            <p>{this.props.alertMessage}</p>
            <FacebookLogin
                appId={process.env.NODE_ENV === 'production' ? prod_app_id : test_app_id}
                language="pl_PL"
                autoLoad={true}
                scope="public_profile,email,user_managed_groups"
                callback={this.props.loginUser}
                fields="id,email,name,first_name,picture,groups{administrator}"
                cssClass="btn btn-social btn-facebook"
                icon={"fa fa-facebook"}
                version="v2.8"
            />
        </Alert>)
    }
}
LoginAlert.propTypes = {
    loginUser: React.PropTypes.func,
    alertMessage:React.PropTypes.string
};