/**
 * Created by Gryzli on 28.01.2017.
 */
import React, {PropTypes} from "react";
import {Accordion, Checkbox, OverlayTrigger, Panel, Tooltip} from "react-bootstrap";
import "./style.css";
import filters from "./../../filters";
let utils = require('./../../utils');

export default class FilteringOptions extends React.Component {
    render() {
        const {store} = this.context;
        const state = store.getState();
        const props = state.filters;
        const toggleAction = (e) => {
            const target = e.target;
            const {id, checked} = target;
            store.dispatch({type: 'TOGGLE_FILTER', id: id, checked: checked})
        };
        return (<Accordion>
                <Panel header="Filters" bsStyle="info">
                    <Checkbox checked={props['woc_control'].checked} onChange={toggleAction} id="woc">
                        <OverlayTrigger placement="top"
                                        overlay={<Tooltip
                                            id="woc">{`Will show all [${utils.woc_string}]`}</Tooltip>}>
                            <span>
                            [{utils.woc_string}]</span></OverlayTrigger>
                    </Checkbox>
                    <span>Show only posts:</span><br/>
                    <div style={{paddingLeft: 10}}>
                        {filters.control.map((elem) => {
                            return (<Checkbox {...elem.control} checked={props[elem.input.name].checked}
                                              onChange={toggleAction} key={elem.input.name}>
                                {elem.description.start}<input className="num_days" type="number" min={0} step={1}
                                                               id={elem.control.id}
                                                               value={props[elem.input.name].days}
                                                               onChange={(e) => {
                                                                   const target = e.target;
                                                                   const {id, name, value} = target;
                                                                   store.dispatch({
                                                                       type: 'UPDATE_DAYS',
                                                                       id: id,
                                                                       name: name,
                                                                       value: Number(value)
                                                                   })
                                                               }}/>{elem.description.end}
                            </Checkbox>)
                        })}
                    </div>
                </Panel>
            </Accordion>
        )
    }
}
FilteringOptions.contextTypes = {
    store: PropTypes.object
}
FilteringOptions.propTypes = {
    state: PropTypes.object,
    onChange: PropTypes.func,
    woc_string: PropTypes.string
};