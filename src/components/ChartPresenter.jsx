/**
 * Created by Gryzli on 06.04.2017.
 */
import React from "react";
import PropTypes from 'prop-types';
import {Tab, Tabs} from "react-bootstrap";
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
        const {view_chart, error_days, newsLetter} = chart.length > 0 ? filterChart(store) : {view_chart: [], error_days: [], newsLetter:[]};
        let selected = view_chart.filter((elem) => elem.selected);
        sorting[list_sort](selected);

        return (<div>
            <Tabs defaultActiveKey={0} id="chart_tabs">
                <Tab eventKey={0} title={<i className="fa fa-facebook">Posts</i>}>
                    <ChartHeader error_days={error_days} view_chart={view_chart}/>
                    <ChartTable data={view_chart}/>
                </Tab>
                <Tab eventKey={1} title={<i className="fa fa-spotify" id="chart_playlist_tab">Playlist</i>}>
                    <SpotifySearch selected={selected}/>
                </Tab>
                <Tab eventKey={2} title={<i className="fa fa-list">Summary</i>}>
                    <Summary selected={selected}/>
                </Tab>
                <Tab eventKey={3} title={<i className="fa fa-table">News Letters</i>}>
                    <ChartTable data={newsLetter}/>
                </Tab>
            </Tabs>
        </div>);
    }
}
ChartPresenter.contextTypes = {
    store: PropTypes.object
};
ChartPresenter.propTypes = {
};