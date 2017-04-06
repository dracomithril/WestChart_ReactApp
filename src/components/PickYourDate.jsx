/**
 * Created by Gryzli on 12.02.2017.
 */
import React, {PropTypes} from "react";
import {Accordion, Button, Checkbox, Label, Panel} from "react-bootstrap";
import DatePicker from "react-datepicker";
let utils = require('./../utils');
export default class PickYourDate extends React.Component {
    updateChart() {
        const {store} = this.context;
        const {user, enable_until, start_date, show_last} = store.getState();
        let until = enable_until ? start_date.toDate() : new Date();

        let since = utils.subtractDaysFromDate(until, show_last);
        const since2 = since.toISOString();
        const until2 = until.toISOString();
        store.dispatch({type: 'UPDATE_SINCE', date: since2});
        store.dispatch({type: 'UPDATE_UNTIL', date: until2});

        const query_params = {
            days: undefined,
            since: since2,
            utils: until2,
            access_token: user.accessToken
        };
        utils.get_chart_from_server(query_params, store);
    }
    render() {
        const {store} = this.context;
        const {user, enable_until, last_update,start_date,show_last,since,until} = store.getState();
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
                           onChange={(e)=>{
                               store.dispatch({type:'UPDATE_SHOW_LAST',days:Number(e.target.value)})
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
                        onChange={date=>store.dispatch({type:'UPDATE_START_TIME',date})}
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
                    <Button onClick={this.updateChart.bind(this)} bsStyle="primary"
                            disabled={!!user.isGroupAdmin === false}
                    >Update</Button>
                </div>
            </Panel></Accordion>);
    }
}
PickYourDate.contextTypes = {
    store: PropTypes.object.isRequired
};
PickYourDate.propTypes = {};