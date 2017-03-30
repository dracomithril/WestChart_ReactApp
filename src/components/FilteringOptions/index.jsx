/**
 * Created by Gryzli on 28.01.2017.
 */
import React from 'react';
import {Panel, Checkbox, OverlayTrigger, Tooltip, Accordion} from 'react-bootstrap';
import './style.css';
let utils = require('./../../utils');
let num_props = {
    className: "num_days", type: "number",
    min: 0, step: 1
};

export default class FilteringOptions extends React.Component {
    render() {
        return (<Accordion>
                <Panel header="Filters" bsStyle="info">
                    <Checkbox checked={this.props.w_o_c} onChange={this.props.onChange} name="w_o_c">
                        <OverlayTrigger placement="top"
                                        overlay={<Tooltip
                                            id="woc">{`Will show all [${utils.woc_string}]`}</Tooltip>}>
                            <span>
                            [{utils.woc_string}]</span></OverlayTrigger>
                    </Checkbox>
                    <span>Show only posts:</span><br/>
                    <div style={{paddingLeft: 10}}>
                        <Checkbox checked={this.props.date_added_control} name="date_added_control"
                                  onChange={this.props.onChange}>
                            {'added in last '}<input {...num_props} max={31} name="show_added_in"
                                                     value={this.props.show_added_in}
                                                     onChange={this.props.onChange}/>{' days'}
                        </Checkbox>
                        <Checkbox checked={this.props.date_create_control} name="date_create_control"
                                  onChange={this.props.onChange}>
                            {'created in last '}<input {...num_props} max={31} name="show_created_in"
                                                       value={this.props.show_created_in}
                                                       onChange={this.props.onChange}/>{' days'}
                        </Checkbox>
                        <Checkbox checked={this.props.date_update_control} name="date_update_control"
                                  onChange={this.props.onChange}>
                            {'updated in last '}<input {...num_props} max={31} name="show_updated_in"
                                                       value={this.props.show_updated_in}
                                                       onChange={this.props.onChange}/>{' days'}
                        </Checkbox>
                        <Checkbox checked={this.props.more_then_control} name="more_then_control"
                                  onChange={this.props.onChange}>
                            {'more then '}<input {...num_props} name="more_then" value={this.props.more_then}
                                                 onChange={this.props.onChange}/>
                        </Checkbox>
                        <Checkbox checked={this.props.less_then_control} name="less_then_control"
                                  onChange={this.props.onChange}>
                            {'less then '}<input {...num_props} name="less_then" value={this.props.less_then}
                                                 onChange={this.props.onChange}/>
                        </Checkbox>
                    </div>
                </Panel>
            </Accordion>
        )
    }
}
FilteringOptions.propTypes = {
    state: React.PropTypes.object,
    onChange: React.PropTypes.func,
    woc_string: React.PropTypes.string
};