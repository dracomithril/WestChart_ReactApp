/**
 * Created by XKTR67 on 5/25/2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Button, ButtonGroup, Label, OverlayTrigger, Popover} from "react-bootstrap";
import SongsPerDay from "./SongsPerDay";
import FilteringOptions from "./FilteringOptions";
import PickYourDate from "./PickYourDate";
import "./components.css";
let utils = require('./../utils');

export default class ChartHeader extends React.Component {
    render() {
        const {store} = this.context;
        const {since, until, last_update} = store.getState();
        const {count, error_days} = this.props;
        const options = {weekday: 'short', month: '2-digit', day: 'numeric'};
        return (<div className="chartHeader">
            <div className="dock1">
                <SongsPerDay error_days={error_days}/>
                <PickYourDate/>
            </div>
            <small>{count}</small>
            <div className="chartButtons">
                <ButtonGroup bsSize="large">
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
                        <Button id="updateChartB" onClick={() => utils.UpdateChart(store)}
                                bsStyle="primary">Update</Button>
                    </OverlayTrigger>
                    <FilteringOptions/>
                </ButtonGroup>
            </div>

        </div>)
    }
}
ChartHeader.contextTypes = {
    store: PropTypes.object
};
