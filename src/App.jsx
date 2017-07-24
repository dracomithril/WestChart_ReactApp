import React, {Component} from "react";
import PropTypes from "prop-types";
import LoginAlert from "./components/LoginAlert";
import Footer from "./components/Footer";
import ChartPresenter from "./components/ChartPresenter";
import PlaylistCombiner from "./components/PlaylistCombiner";
import {Tab, Tabs} from "react-bootstrap";
import "./App.css";
import "react-table/react-table.css";
import "react-datepicker/dist/react-datepicker.css";
const {validateCredentials} = require("./spotify_utils");
const {cookies_name} = require('./utils');
const action_types = require('./reducers/action_types');
const Cookies = require('cookies-js');

class App extends Component {
    componentDidMount() {
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }

    componentWillMount() {
        console.log('will mount App');
        const {store} = this.context;
        const sp_user_ac = Cookies.get(cookies_name.access_token);
        if (sp_user_ac) {
            store.dispatch({type: action_types.TOGGLE_HAS_COOKIE, value: true});
            validateCredentials(sp_user_ac).then(res => {
                store.dispatch({
                    type: action_types.UPDATE_SP_USER,
                    user: res.user,
                    access_token: res.access_token
                });

            });
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const {store} = this.context;
        const {location, history} = this.props;
        const alert_props = {location, history};
        const {user, sp_user} = store.getState();
        const isLogged = user.id !== undefined && sp_user.id !== undefined;
        return (
            <div className="App">
                {!isLogged ? <LoginAlert {...alert_props}/> :
                    <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" className="App-body">
                        <Tab eventKey={1} title="Chart"><ChartPresenter/></Tab>
                        {/*<Tab eventKey={2} title="Summary" disabled={true}/>*/}
                        <Tab eventKey={3} title="Combiner (BETA)"><PlaylistCombiner/></Tab>
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
