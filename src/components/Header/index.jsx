/**
 * Created by Gryzli on 25.01.2017.
 */
import React from 'react';
import {Image, Well} from 'react-bootstrap';
import logo from './starter.png';
import 'bootstrap-social';
import './Header.css';
export default class Header extends React.Component {
       render() {
        const user = this.props.user;
        return (<div className="header">
            <img src={logo} className="App-logo" alt="logo"/>
            {this.props.showUserInfo &&<Well bsClass="logged">
                 <div>
                    <Image src={user.picture.data.url} circle/>
                    <span>{`Hi, ${user.first_name}`}</span><br/>
                    <span>{`it's nice to see you again.`}</span>
                </div>
            </Well>}
        </div>);
    }
}
Header.propTypes = {
    user: React.PropTypes.object,
    showUserInfo: React.PropTypes.bool
};