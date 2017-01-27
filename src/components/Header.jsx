/**
 * Created by Gryzli on 25.01.2017.
 */
import React from 'react';
import {Image, Well} from 'react-bootstrap';
import logo from './starter.png';
import {FacebookLogin} from 'react-facebook-login-component';
import 'bootstrap-social';
export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                accessToken: undefined,
                email: undefined,
                id: undefined,
                name: undefined,
                first_name: undefined,
                picture: {data: {url: undefined}}
            }
        }
    }

    responseFacebook(response) {
        this.setState({user: response});
        this.props.updateToken(response.accessToken);
    }

    render() {
        const user = this.state.user;
        let showIt = this.state.user.accessToken === undefined;
        return (<div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <Well bsClass={showIt ? "well" : "logged"}>

                {!showIt && <div>
                    <Image src={user.picture.data.url} circle/>
                    <span>{`Hi, ${user.first_name}`}</span><br/>
                    <span>{`it's nice to see you again.`}</span>
                </div>}
                {showIt && <FacebookLogin
                    socialId={process.env.NODE_ENV === 'production' ? "1173483302721639" : "1173486879387948"}
                    language="pl_PL"
                    scope="public_profile,email"
                    responseHandler={this.responseFacebook.bind(this)}
                    xfbml={true}
                    fields="id,email,name,first_name,picture"
                    version="v2.8"
                    class="btn-login"
                    buttonText={<a className="btn btn-block btn-social btn-facebook">
                        <span className="fa fa-facebook"/> Sign in with Facebook
                    </a>}/>}
            </Well>
        </div>);
    }
}
Header.propTypes = {};