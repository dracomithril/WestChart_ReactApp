/**
 * Created by Gryzli on 12.02.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Checkbox, OverlayTrigger, Popover, Tooltip, Button} from "react-bootstrap";
import DatePicker from "react-datepicker";
export default class PickYourDate extends React.Component {
    /*istanbul ignore next*/
    componentWillUnmount() {
        console.log('component ChartPresenter unmounted');
    }

    /*istanbul ignore next*/
    componentDidMount() {
        console.log('component ChartPresenter did mount');
    }

    render() {
        const {store} = this.context;
        const {enable_until, start_date, show_last} = store.getState();
        const footer = <div className="datePiker">
            <Checkbox checked={enable_until} name="enable_until"
                      onChange={(e) => store.dispatch({
                          type: 'TOGGLE_ENABLE_UNTIL',
                          checked: e.target.checked
                      })}>{'Use date: '}
                <DatePicker
                    selected={start_date}
                    dateFormat="DD/MM/YYYY"
                    onChange={date => store.dispatch({type: 'UPDATE_START_TIME', date})}
                    disabled={!enable_until}/>
            </Checkbox>
        </div>;
        return (<div id="pickYourDate">
                <OverlayTrigger trigger={["hover", "focus"]} overlay={<Tooltip id="go_back">
                    {'How far in time you will travel'}
                </Tooltip>}>
                    <span style={{paddingRight:10}}>{'go back '}
                        <input className="num_days"
                               type="number"
                               name="show_last"
                               min={0} max={62}
                               value={show_last}
                               step={1}
                               onChange={(e) => {
                                   store.dispatch({type: 'UPDATE_SHOW_LAST', days: Number(e.target.value)})
                               }}/>{' days'}
                    </span>
                </OverlayTrigger>
                <OverlayTrigger trigger={"click"} placement="bottom" overlay={<Popover id="more_options_chose_date">
                    {footer}
                </Popover>}>
                    <Button className="fa fa-angle-double-down" bsSize="small"/>
                </OverlayTrigger>
            </div>);
    }
}
PickYourDate.contextTypes = {
    store: PropTypes.object.isRequired
};
PickYourDate.propTypes = {};