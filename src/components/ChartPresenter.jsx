/**
 * Created by Gryzli on 06.04.2017.
 */
import React from "react";
import PropTypes from 'prop-types';
import {Jumbotron} from "react-bootstrap";
import Summary from "./Summary";
import ChartTable from "./ChartTable";
import ChartHeader from "./ChartHeader";
import SpotifySearch from "./SpotifySearch";
const {sorting, filterChart} = require('./../utils');


export default class ChartPresenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    /*istanbul ignore next*/
    componentWillUnmount() {
        console.log('component ChartPresenter unmounted');
    }

    /*istanbul ignore next*/
    componentDidMount() {
        console.log('component ChartPresenter did mount');
    }

    render() {
        const {store} = this.context;
        const {list_sort, chart} = store.getState();
        const {view_chart, error_days} = chart.length > 0 ? filterChart(store) : {view_chart: [], error_days: []};
        let selected = view_chart.filter((elem) => elem.selected);
        sorting[list_sort](selected);
        return (
            <Jumbotron bsClass="App-body">
                <div>
                    <ChartHeader error_days={error_days} count={view_chart.length}/>
                    <ChartTable data={view_chart} error_days={error_days}/>
                    <Summary selected={selected}/>
                    <SpotifySearch selected={selected}/>
                </div>
            </Jumbotron>);
    }
}
ChartPresenter.contextTypes = {
    store: PropTypes.object
};
ChartPresenter.propTypes = {
    view_chart: PropTypes.array,
    error_days: PropTypes.array
};