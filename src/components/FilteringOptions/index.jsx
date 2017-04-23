/**
 * Created by Gryzli on 28.01.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Accordion, Checkbox, OverlayTrigger, Panel, Tooltip} from "react-bootstrap";
import FilterSettings from "./FilterOption";
import "./FilteringOptions.css";
import filters_def from "./../../filters";
let utils = require('./../../utils');

export default class FilteringOptions extends React.Component {
    render() {
        const {store} = this.context;
        const {filters} = store.getState();
        const map = filters_def.control.map((elem) => {
            return (<FilterSettings {...elem} key={elem.input.name}/>)
        });

        return (<Accordion>
                <Panel header="Filters" bsStyle="info">
                    <Checkbox checked={filters['woc_control'].checked} onChange={(e) => {
                        const {id, checked} = e.target;
                        store.dispatch({type: 'TOGGLE_FILTER', id: id, checked: checked})
                    }} id="woc">
                        <OverlayTrigger placement="top" overlay={<Tooltip
                            id="woc">{`Will show all [${utils.woc_string}]`}</Tooltip>}>
                            <span>
                            [{utils.woc_string}]</span>
                        </OverlayTrigger>
                    </Checkbox>
                    <span>Show only posts:</span><br/>
                    <div style={{paddingLeft: 10}}>
                        {map}
                    </div>
                </Panel>
            </Accordion>
        )
    }
}
FilteringOptions.contextTypes = {
    store: PropTypes.object
};
FilteringOptions.propTypes = {};