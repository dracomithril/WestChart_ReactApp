/**
 * Created by Gryzli on 12.02.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Checkbox, OverlayTrigger, Panel, Tooltip} from "react-bootstrap";
import DatePicker from "react-datepicker";
export default class PickYourDate extends React.Component {
    /*istanbul ignore next*/
    componentWillUnmount() {
        console.log('component ChartPresenter unmounted');
    }

    /*istanbul ignore next*/
    componentDidMount() {
        console.log('component ChartPresenter did mount');
        const {store} = this.context;
        const {user} = store.getState();
        if (user.isGroupAdmin) {
            //this.updateChart()
        }
    }

    render() {
        const {store} = this.context;
        const {enable_until, start_date, show_last} = store.getState();
        return (
            <Panel style={{float: 'left'}} id="pickYourDate">
                <div style={{float: 'left'}}>
                    <OverlayTrigger trigger={["hover", "focus"]} overlay={<Tooltip id="go_back">
                        {'How far in time you will travel'}
                    </Tooltip>}>
                        <label>{'go back '}
                            <input className="num_days"
                                   type="number"
                                   name="show_last"
                                   min={0} max={62}
                                   value={show_last}
                                   step={1}
                                   onChange={(e) => {
                                       store.dispatch({type: 'UPDATE_SHOW_LAST', days: Number(e.target.value)})
                                   }}/>{' days'}
                        </label>
                    </OverlayTrigger>
                    <div className="datePiker">

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
                    </div>

                </div>
            </Panel>);
    }
}
PickYourDate.contextTypes = {
    store: PropTypes.object.isRequired
};
PickYourDate.propTypes = {};