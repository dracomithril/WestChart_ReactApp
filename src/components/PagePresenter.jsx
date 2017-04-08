/**
 * Created by Gryzli on 08.04.2017.
 */
import React from 'react';
import PickYourDate from "./PickYourDate";
import MainMenu from "./Menu";
import ChartPresenter from "./ChartPresenter";
import {Modal} from "react-bootstrap";
import FilteringOptions from "./FilteringOptions";
import SongsPerDay from "./SongsPerDay";
let utils = require('./../utils');

const WaitMessage = (props) => {
    return (<Modal show={props.show}>
        <Modal.Header>{"Hello"}</Modal.Header>
        <Modal.Body>{`Hi, ${props.user_name} we are fetching data please wait.`}</Modal.Body>
    </Modal>)
};
export default class PagePresenter extends React.Component {
    componentWillUnmount() {
        console.log('component PagePresenter unmounted');
    }

    componentDidMount() {
        console.log('component PagePresenter did mount');
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
        return (<div>
            <WaitMessage show={chart.length === 0} user_name={user.first_name}/>
            {user.isGroupAdmin && <MainMenu/>}
            {user.isGroupAdmin &&
            <div>
                <div className="formArea">
                    <SongsPerDay error_days={error_days1}/>
                    <PickYourDate />
                    <FilteringOptions />
                </div>
                <ChartPresenter view_chart={view_chart1}/>
            </div>}

        </div>);
    }
}
PagePresenter.contextTypes={
    store:React.PropTypes.object
};
PagePresenter.propTypes = {};