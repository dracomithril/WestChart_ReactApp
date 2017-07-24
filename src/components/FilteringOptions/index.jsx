/**
 * Created by Gryzli on 28.01.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Checkbox, OverlayTrigger, Tooltip} from "react-bootstrap";
import FilterOption from "./FilterOption";
import "./FilteringOptions.css";
import filters_def from "./../../filters_def";

const action_types = require('./../../reducers/action_types');


class MessageControl extends React.Component {
    render() {

        const {store} = this.context;
        const {filters} = store.getState();
        const name = this.props.input.name;
        return <Checkbox checked={!filters[name].checked} onChange={(e) => {
            const {id, checked} = e.target;
            store.dispatch({type: action_types.TOGGLE_FILTER, id: id, checked: !checked})
        }} {...this.props.control}>
            <OverlayTrigger placement="top" overlay={<Tooltip
                id={name + "_tp"}>{`Will show all [${this.props.text}]`}</Tooltip>}>
                            <span>
                            [{this.props.text}]</span>
            </OverlayTrigger>
        </Checkbox>

    }
}

MessageControl.contextTypes = {
    store: PropTypes.object
};
MessageControl.propTypes = {
    input: PropTypes.object,
    text: PropTypes.string
};

export default class FilteringOptions extends React.Component {
    render() {
        const map = filters_def.control.map((elem) => {
            return (<FilterOption {...elem} key={elem.input.name}/>)
        });
        const map_t = filters_def.text.map((elem) => {
            return (<MessageControl {...elem} key={elem.input.name}/>)
        });
        return (
            <div className="filter_panel">
                {map_t}
                {map}
            </div>

        )
    }
}
FilteringOptions.contextTypes = {
    store: PropTypes.object
};
FilteringOptions.propTypes = {};