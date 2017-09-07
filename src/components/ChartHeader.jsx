/**
 * Created by XKTR67 on 5/25/2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Button, Label, OverlayTrigger, Popover} from "react-bootstrap";
import SongsPerDay from "./SongsPerDay";
import FilteringOptions from "./FilteringOptions";
import PickYourDate from "./PickYourDate";
import "./components.css";

const action_types = require('./../reducers/action_types');

let utils = require('./../utils');

export default class ChartHeader extends React.Component {
    render() {
        const {store} = this.context;
        const {since, until, last_update} = store.getState();
        const {error_days} = this.props;
        const options = {weekday: 'short', month: '2-digit', day: 'numeric'};
        return (<div className="chartHeader">
            <div className="dock1">
                <SongsPerDay error_days={error_days}/>
                <PickYourDate/>
            </div>
            <div className="chartButtons">
                <OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={<Popover id="update_info">
                    <span>{"since: "}</span>
                    <Label
                        bsStyle="success">{since !== '' ? new Date(since).toLocaleDateString('pl-PL', options) : 'null'}</Label>
                    <span>{" to "}</span>
                    <Label
                        bsStyle="danger">{until !== '' ? new Date(until).toLocaleDateString('pl-PL', options) : 'null'}</Label><br/>
                    <small
                        id="updateDate">{' Last update: ' + new Date(last_update).toLocaleString('pl-PL')}</small>
                </Popover>}>
                    <div>
                        <Button id="updateChartB" onClick={() => utils.UpdateChart(store)}
                                bsStyle="primary">Update</Button>
                        <Button id={"quickSummary"} onClick={() => {
                            utils.UpdateChart(store).then(() => {
                                store.dispatch({type: action_types.TOGGLE_ALL});
                                return Promise.resolve();
                            }).then(() => {
                                const elementById = document.getElementById("start_sp_button");
                                elementById.click();
                                location.hash="#summary";
                            });
                        }} bsStyle="success">Quick summary</Button>
                    </div>
                </OverlayTrigger>
            </div>
            <FilteringOptions/>
        </div>)
    }
}
ChartHeader.contextTypes = {
    store: PropTypes.object
};
ChartHeader.propTypes = {
    error_days: PropTypes.array
};
