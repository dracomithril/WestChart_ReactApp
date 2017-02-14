/**
 * Created by Gryzli on 28.01.2017.
 */
import React from 'react';
import {Alert} from 'react-bootstrap';
import {FacebookLogin} from 'react-facebook-login-component';
import './LoginAlert.css';
export default class LoginAlert extends React.Component {
    render() {
        return (<Alert bsClass="login-alert">
            <h4>Oh snap! You got an error!</h4>
            <p>{this.props.alertMessage}</p>
            <FacebookLogin
                socialId={process.env.NODE_ENV === 'production' ? "1173483302721639" : "1173486879387948"}
                language="pl_PL"
                scope="public_profile,email,user_managed_groups"
                responseHandler={this.props.loginUser}
                xfbml={true}
                fields="id,email,name,first_name,picture,groups{administrator}"
                version="v2.8"
                class="btn-login"
                buttonText={<a className="btn btn-block btn-social btn-facebook">
                    <span className="fa fa-facebook"/> Sign in with Facebook
                </a>}/>
        </Alert>)
    }
}
LoginAlert.propTypes = {
    loginUser: React.PropTypes.func,
    alertMessage:React.PropTypes.string
};