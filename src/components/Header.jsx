/**
 * Created by Gryzli on 25.01.2017.
 */
import React from 'react';
import {Grid, Row, Col, Panel, Image} from 'react-bootstrap';
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
            <Grid>
                <Row className="show-grid">
                    <Col xs={8} md={6}><img src={logo} className="App-logo" alt="logo"/></Col>
                    <Col xs={6} md={3}>
                        <Panel header="User info" bsStyle={showIt?"warning":"primary"}>
                            {!showIt && <div>
                                <Image src={user.picture.data.url} circle/>
                                <span
                                    style={{color: 'black'}}>{`Hi, ${user.first_name} it's nice to see you again.`}</span>
                            </div>}
                            <a className="btn btn-block btn-social btn-twitter">
                                <span className="fa fa-twitter"/>
                                Sign in with Twitter
                            </a>
                            {showIt && <FacebookLogin
                                socialId={process.env.NODE_ENV === 'production' ? "1173483302721639" : "1173486879387948"}
                                language="pl_PL"
                                scope="public_profile,email"
                                responseHandler={this.responseFacebook.bind(this)}
                                xfbml={true}
                                fields="id,email,name,first_name,picture"
                                version="v2.8"
                                class="btn-block btn-social btn-sm btn-facebook"
                                buttonText="Login With Facebook"/>}
                        </Panel>
                    </Col>
                </Row>
            </Grid>

        </div>);
    }
}
Header.propTypes = {};