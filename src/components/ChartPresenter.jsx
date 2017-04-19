/**
 * Created by Gryzli on 06.04.2017.
 */
import React from "react";
import PropTypes from 'prop-types';
import {Jumbotron} from "react-bootstrap";
import Summary from "./Summary";
import ChartTable from "./ChartTable";
import SpotifySearch from "./SpotifySearch";
const {sorting} = require('./../utils');


export default class ChartPresenter extends React.Component {
    componentWillUnmount() {
        console.log('component ChartPresenter unmounted');
    }

    componentDidMount() {
        console.log('component ChartPresenter did mount');
    }

    render() {
        const {store} = this.context;
        const {list_sort} = store.getState();
        const {view_chart} = this.props;
        let selected = view_chart.filter((elem) => elem.selected);
        sorting[list_sort](selected);
        return (
            <Jumbotron bsClass="App-body">
                <div>
                    <ChartTable data={view_chart}/>
                    <Summary selected={selected}/>
                    <SpotifySearch selected={selected}/>
                </div>
            </Jumbotron>);
    }
}
ChartPresenter.contextTypes = {
    store: PropTypes.object
};
ChartPresenter.propTypes = {};