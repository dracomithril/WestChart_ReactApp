/**
 * Created by Gryzli on 23.04.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Checkbox} from "react-bootstrap";

export default class FilterOption extends React.Component {
    render() {
        const {store} = this.context;
        const {filters} = store.getState();
        return (<Checkbox {...this.props.control} checked={filters[this.props.input.name].checked}
                          onChange={(e) => {
                              const {id, checked} = e.target;
                              store.dispatch({type: 'TOGGLE_FILTER', id: id, checked: checked})
                          }} >
            {this.props.description.start}
            <input className="num_days" type="number" min={0} step={1}
                   id={this.props.control.id}
                   value={filters[this.props.input.name].days}
                   onChange={(e) => {
                       const target = e.target;
                       const {id, name, value} = target;
                       store.dispatch({
                           type: 'UPDATE_DAYS',
                           id: id,
                           name: name,
                           value: Number(value)
                       })
                   }}/>{this.props.description.end}
        </Checkbox>);
    }
}
FilterOption.contextTypes = {
    store: PropTypes.object
};
FilterOption.propTypes = {};