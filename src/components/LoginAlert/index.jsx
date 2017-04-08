/**
 * Created by Gryzli on 28.01.2017.
 */
import React, {PropTypes} from "react";
import { Jumbotron} from "react-bootstrap";
import FacebookLogin from "react-facebook-login";
import "./LoginAlert.css";
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

    componentDidMount() {
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
        console.log('component LoginAlert did mount');
    }
    componentWillUnmount() {
        this.unsubscribe();
        console.log('component LoginAlert unmounted');
    }
    render() {
        const {store} = this.context;
        const {user, sp_user} = store.getState();

        return (<Jumbotron bsClass="login-info">
            <h4>{'To start working witch us you need to login to facebook and spotify.'}<i className="fa fa-heart"/></h4>
            <p>{!user.isGroupAdmin ? notGroupAdmin : ''}</p>
            {user.id===undefined&&<FacebookLogin
                appId={process.env.NODE_ENV === 'production' ? "1173483302721639" : "1173486879387948"}
                language="pl_PL"
                autoLoad={true}
                scope="public_profile,email,user_managed_groups"
                callback={(response) => {
                    if (!response.error) {
                        store.dispatch({type: 'UPDATE_USER', user: map_user(response)});
                    } else {
                        console.error('login error.');
                        console.error(response.error);
                    }
                }}
                fields="id,email,name,first_name,picture,groups{administrator}"
                cssClass="btn btn-social btn-facebook"
                icon={"fa fa-facebook"}
                version="v2.8"
            />}
            {sp_user.id === undefined &&
            <a href={process.env.NODE_ENV === 'development' ? "http://localhost:3001/api/login" : "/api/login"}
               className="btn btn-social btn-spotify"><i className="fa fa-spotify"/>Login to
                spotify</a>}
        </Jumbotron>)
    }
}
LoginAlert.contextTypes = {
    store: PropTypes.object
};
LoginAlert.propTypes = {
    loginUser: PropTypes.func,
    alertMessage: PropTypes.string
};