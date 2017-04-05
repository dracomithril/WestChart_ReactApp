/**
 * Created by Gryzli on 25.01.2017.
 */
import React, {PropTypes} from "react";
import {Image, PageHeader, Well} from "react-bootstrap";
import "bootstrap-social";
import "./Header.css";
export default class Header extends React.Component {
    render() {
        const {store} = this.context;
        let state = store.getState();
        const user = state.user;
        return (<div className="header">
            <PageHeader bsClass="title-header">West Coast Swing Dance Chart
                <small>Admin helper</small>
            </PageHeader>
            {user.name && <Well bsClass="logged">
                <div>
                    <Image src={user.picture_url} circle/>
                    <span>{`Hi, ${user.first_name}`}</span><br/>
                    <span>{`it's nice to see you again.`}</span>
                </div>
            </Well>}
        </div>);
    }
}
Header.contextTypes = {
    store: PropTypes.object
};
Header.propTypes = {
    user: PropTypes.object
};