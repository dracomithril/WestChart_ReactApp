/**
 * Created by Gryzli on 12.02.2017.
 */
import React from "react";
import PropTypes from 'prop-types';
import {Accordion, Button, Checkbox, Label, Panel} from "react-bootstrap";
import DatePicker from "react-datepicker";
let utils = require('./../utils');
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
        const {enable_until, last_update, start_date, show_last, since, until} = store.getState();
        const footer = (<small
            id="updateDate">{' Last update: ' + new Date(last_update).toLocaleString('pl-PL')}</small>);
        return (<Accordion>
            <Panel header="Pick your date" footer={footer}>
                <label>{'How far in time you will travel '}
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
                {(since !== '' && until !== '') &&
                <div>
                    <Label
                        bsStyle="success">{`since: ` + new Date(since).toLocaleString('pl-PL')}</Label><br/>
                    <Label id="d_until"
                           bsStyle="danger">{`until: ` + new Date(until).toLocaleString('pl-PL')}</Label>
                </div>}
                <div style={{textAlign: "center"}}>
                    <Button id="updateChartB" onClick={() => utils.UpdateChart(store)} bsStyle="primary">Update</Button>
                </div>
            </Panel></Accordion>);
    }
}
PickYourDate.contextTypes = {
    store: PropTypes.object.isRequired
};
PickYourDate.propTypes = {};