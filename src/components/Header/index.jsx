/**
 * Created by Gryzli on 25.01.2017.
 */
import React from 'react';
import {Image, Well,PageHeader} from 'react-bootstrap';
import 'bootstrap-social';
import './Header.css';
export default class Header extends React.Component {
       render() {
        const user = this.props.user;
        return (<div className="header">
            <PageHeader bsClass="title-header">West Coast Swing Dance Chart <small>Admin helper</small></PageHeader>
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