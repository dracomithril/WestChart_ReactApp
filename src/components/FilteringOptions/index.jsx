/**
 * Created by Gryzli on 28.01.2017.
 */
import React from 'react';
import {Panel, Checkbox, OverlayTrigger, Tooltip} from 'react-bootstrap';
import './style.css';
export default class FilteringOptions extends React.Component {
    render() {
        return (
            <Panel header="Filters" bsStyle="info">
                <Checkbox checked={this.props.state.w_o_c} onChange={this.props.onChange} name="w_o_c">
                    <OverlayTrigger placement="top"
                                    overlay={<Tooltip
                                        id="woc">{`Will show all [${this.props.woc_string}]`}</Tooltip>}>
                            <span>
                            [{this.props.woc_string}]</span></OverlayTrigger>
                </Checkbox>
                <Checkbox checked={this.props.state.date_create_control} name="date_create_control"
                          onChange={this.props.onChange}>
                    {'Show only posts created in last '}<input className="num_days" type="number"
                                                               name="show_created_in"
                                                               min={0} max={31}
                                                               value={this.props.state.show_created_in}
                                                               step={1}
                                                               onChange={this.props.onChange}/>{' days'}
                </Checkbox>
                <Checkbox checked={this.props.state.date_update_control} name="date_update_control"
                          onChange={this.props.onChange}>
                    {'Show only posts updated in last '}<input className="num_days" type="number"
                                                               name="show_updated_in"
                                                               min={0} max={31}
                                                               value={this.props.state.show_updated_in}
                                                               step={1}
                                                               onChange={this.props.onChange}/>{' days'}
                </Checkbox>
            </Panel>
        )
    }
}
FilteringOptions.propTypes = {
    state:React.PropTypes.object,
    onChange:React.PropTypes.func,
    woc_string: React.PropTypes.string
};