import React, {Component, PropTypes} from "react";
import LoginAlert from "./components/LoginAlert";
import Footer from "./components/Footer";
import PagePresenter from "./components/PagePresenter";
import "./App.css";
import "react-table/react-table.css";
import "react-datepicker/dist/react-datepicker.css";
import Spotify from "spotify-web-api-node";
const spotifyApi = new Spotify();

class App extends Component {
    componentWillUnmount() {
        this.unsubscribe();
    }
    componentDidMount() {
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
        const {location, history} = this.props;
        const {hash} = location;
        if (hash.includes('/user/')) {
            let params = hash.replace('#/user/', '');
            let arr = params.split('/');
            const access_token = arr[0];
            const refresh_token = arr[1];
            spotifyApi.setAccessToken(access_token);
            spotifyApi.getMe()
                .then(function(data) {
                    console.log('Some information about the authenticated user', data.body);
                }, function(err) {
                    console.log('Something went wrong!', err);
                });
            spotifyApi.getMe().then(data => {
                console.log('you loged as :',data.body.id);
                store.dispatch({type: 'UPDATE_SP_USER',user:data.body, access_token, refresh_token});
                history.push('/#/siema_jak_zycie')
            }).catch(e => {
                console.log(JSON.stringify(e));
            });
        }
    }

    render() {
        const {store} = this.context;
        const state = store.getState();
        const {user, sp_user} = state;
        const isLogged= user.id!==undefined&&sp_user.id!==undefined;
        return (
            <div className="App">
                {!isLogged&&<LoginAlert/>}
                {isLogged&&<PagePresenter/>}
                <Footer/>
            </div>
        );
    }
}
App.contextTypes = {
    store: PropTypes.object
};
export default App;
