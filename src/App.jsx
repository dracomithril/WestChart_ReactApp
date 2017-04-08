import React, {Component, PropTypes} from "react";
import {Modal} from "react-bootstrap";
import ChartPresenter from "./components/ChartPresenter";
import Header from "./components/Header";

import FilteringOptions from "./components/FilteringOptions";
import SongsPerDay from "./components/SongsPerDay";
import LoginAlert from "./components/LoginAlert";
import Footer from "./components/Footer";
import PickYourDate from "./components/PickYourDate";
import MainMenu from "./components/Menu";
import "./App.css";
import "react-table/react-table.css";
import "react-datepicker/dist/react-datepicker.css";
let utils = require('./utils');

const WaitMessage = (props) => {
    return (<Modal show={props.show}>
        <Modal.Header>{"Hello"}</Modal.Header>
        <Modal.Body>{`Hi, ${props.user_name} we are fetching data please wait.`}</Modal.Body>
    </Modal>)
};
class App extends Component {
    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }

    render() {
        const {store} = this.context;
        const {user, chart} = store.getState();
        let view_chart1 = [], error_days1 = [];
        if (chart.length > 0) {
            let {view_chart, error_days} = utils.filterChart(store);
            view_chart1 = view_chart;
            error_days1 = error_days;
        }
        return (
            <div className="App">
                <Header/>
                <WaitMessage show={false/*state.chart.length === 0*/} user_name={user.first_name}/>
                {user.isGroupAdmin && <MainMenu/>}
                {!user.isGroupAdmin && <LoginAlert />}
                {user.isGroupAdmin &&
                <div>
                    <div className="formArea">
                        <SongsPerDay error_days={error_days1}/>
                        <PickYourDate />
                        <FilteringOptions />
                    </div>
                    <ChartPresenter view_chart={view_chart1}/>
                </div>}
                <Footer/>
            </div>
        );
    }
}
App.contextTypes = {
    store: PropTypes.object
};
export default App;
