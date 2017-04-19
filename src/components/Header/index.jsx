/**
 * Created by Gryzli on 25.01.2017.
 */
import React from "react";
import PropTypes from 'prop-types';
import { PageHeader} from "react-bootstrap";
import CookieBanner from "react-cookie-banner";
import UserInfo from "./../UserInfo";
import "bootstrap-social";
import "./Header.css";

export default class Header extends React.Component {
    componentDidMount() {
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const {store} = this.context;
        let {user} = store.getState();
        return (<div className="header">
                            <CookieBanner
                    message={'Yes, we use cookies. If you don\'t like it change website, we won\'t miss you! ;)'}
                    onAccept={() => {
                    }}
                    cookie='user-has-accepted-cookies'/>

            <PageHeader bsClass="title-header">West Coast Swing Dance Chart
                <small>Admin helper</small>
            </PageHeader>
            {user.name && <UserInfo/>}
        </div>);
    }
}
Header.contextTypes = {
    store: PropTypes.object
};
Header.propTypes = {
};