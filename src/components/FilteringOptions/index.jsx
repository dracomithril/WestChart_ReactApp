/**
 * Created by Gryzli on 28.01.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import { Checkbox, OverlayTrigger, Tooltip, Button, Popover} from "react-bootstrap";
import FilterOption from "./FilterOption";
import "./FilteringOptions.css";
import filters_def from "./../../filters_def";
let utils = require('./../../utils');
const action_types = require('./../../reducers/action_types');

export default class FilteringOptions extends React.Component {
    render() {
        const {store} = this.context;
        const {filters} = store.getState();
        const map = filters_def.control.map((elem) => {
            return (<FilterOption {...elem} key={elem.input.name}/>)
        });

        return (
        <OverlayTrigger trigger={["click"]} rootClose
                        placement="bottom" overlay={<Popover id="filters_p">
            <div >
                <Checkbox checked={filters['woc_control'].checked} onChange={(e) => {
                    const {id, checked} = e.target;
                    store.dispatch({type:action_types.TOGGLE_FILTER, id: id, checked: checked})
                }} id="woc_cb">
                    <OverlayTrigger placement="top" overlay={<Tooltip
                        id="woc_tp">{`Will show all [${utils.woc_string}]`}</Tooltip>}>
                            <span>
                            [{utils.woc_string}]</span>
                    </OverlayTrigger>
                </Checkbox>
                <span>Show only posts:</span><br/>
                <div style={{paddingLeft: 10}}>
                    {map}
                </div>
            </div>
        </Popover>}>
            <Button bsStyle="info" id="bFilters">
                filters
            </Button>
        </OverlayTrigger>

        )
    }
}
FilteringOptions.contextTypes = {
    store: PropTypes.object
};
FilteringOptions.propTypes = {};