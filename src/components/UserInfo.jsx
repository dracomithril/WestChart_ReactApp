/**
 * Created by Gryzli on 07.04.2017.
 */
import React from "react";
import PropTypes from 'prop-types';
// import Spotify from 'spotify-web-api-js';
import {Image, Well} from "react-bootstrap";
export default class UserInfo extends React.Component {
    componentWillUnmount() {
        console.log('component UserInfo unmounted');
    }

    componentDidMount() {
         // const {store} = this.context;
        console.log('component UserInfo did mount');
    }

    render() {
        const {store} = this.context;
        let {user, sp_user} = store.getState();
        return (
            <Well bsClass="logged">
                <div>
                    <Image src={user.picture_url} circle/>
                    <span>{`Hi, ${user.first_name}`}</span><br/>
                    <span>{`it's nice to see you again.`}</span><br/>
                    {sp_user.id !== undefined &&
                    <div className="spotify">
                        <i className="fa fa-spotify"/>
                        <span >{sp_user.id}</span>
                    </div>}
                </div>
            </Well>);
    }
}
UserInfo.contextTypes = {
    store: PropTypes.object
};

UserInfo.propTypes = {};