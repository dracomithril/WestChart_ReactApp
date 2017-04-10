/**
 * Created by Gryzli on 08.04.2017.
 */
import React from 'react';
import PickYourDate from "./PickYourDate";
import ChartPresenter from "./ChartPresenter";
import {Modal} from "react-bootstrap";
import FilteringOptions from "./FilteringOptions";
import SongsPerDay from "./SongsPerDay";
let utils = require('./../utils');


export default class PagePresenter extends React.Component {
    componentWillUnmount() {
        console.log('component PagePresenter unmounted');
    }

    componentDidMount() {
        console.log('component PagePresenter did mount');
    }
    render() {
        const {store} = this.context;
        const {user, chart, show_wait} = store.getState();
        let view_chart1 = [], error_days1 = [];
        if (chart.length > 0) {
            let {view_chart, error_days} = utils.filterChart(store);
            view_chart1 = view_chart;
            error_days1 = error_days;
        }
        return (<div>
            {user.isGroupAdmin &&
            <div>
                <div className="formArea">
                    <Modal show={show_wait}>
                        <Modal.Header>{"Information"}</Modal.Header>
                        <Modal.Body>{`${user.first_name} we are fetching data please wait.`}</Modal.Body>
                    </Modal>
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