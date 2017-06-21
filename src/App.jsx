import React, {Component} from "react";
import PropTypes from "prop-types";
import LoginAlert from "./components/LoginAlert";
import Footer from "./components/Footer";
import ChartPresenter from "./components/ChartPresenter";
import PlaylistCombiner from './components/PlaylistCombiner';
import {Tab, Tabs} from "react-bootstrap";
import "./App.css";
import "react-table/react-table.css";
import "react-datepicker/dist/react-datepicker.css";
const {loginToSpotify, validateCredentials} = require("./spotify_utils");
const action_types = require('./reducers/action_types');
const Cookies = require('cookies-js');

class App extends Component {
    componentDidMount() {
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
        const {location, history} = this.props;
        let sp_user_str = Cookies.get('sp_user');
        if (sp_user_str) {
            let sp_user = JSON.parse(sp_user_str);
            validateCredentials(sp_user.access_token).then(res => {
                store.dispatch({
                    type: action_types.UPDATE_SP_USER,
                    user: res.user,
                    access_token: res.access_token
                });
            });
        } else {
            const {hash} = location;
            if (hash.includes('/user/')) {
                let params = hash.replace('#/user/', '');
                let arr = params.split('/');
                const access_token = arr[0];
                validateCredentials(access_token).then(res => {
                    Cookies.set('sp_user', JSON.stringify({access_token}), {expires: 3600});
                    store.dispatch({type: 'UPDATE_SP_USER', user: res.user, access_token: res.access_token});
                    history.push('')
                });
            } else {
                loginToSpotify();
            }
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const {store} = this.context;
        const {user, sp_user, errors} = store.getState();
        const isLogged = user.id !== undefined && sp_user.id !== undefined;
        const error_logs = errors.map((el, id) => <div key={'error_' + id}>{el.message}</div>);
        return (
            <div className="App">
                {/*<button className="fa fa-plus" onClick={()=>store.dispatch({type:action_types.ADD_ERROR, error:{message:"New error"}})}/>*/}
                {error_logs.length > 0 && <div className="console-log">

                    <h3>Errors!!!
                        <button className="fa fa-trash-o"
                                onClick={() => store.dispatch({type: action_types.CLEAR_ERRORS})}>clear</button>
                    </h3>

                    {error_logs}
                </div>}
                {!isLogged && <LoginAlert/>}
                {isLogged &&
                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" className="App-body">
                    <Tab eventKey={1} title="Chart"><ChartPresenter/></Tab>
                    <Tab eventKey={2} title="Combiner"><PlaylistCombiner/></Tab>
                </Tabs>}
                <Footer/>
            </div>
        );
    }
}
App.contextTypes = {
    store: PropTypes.object
};
export default App;
