/**
 * Created by Gryzli on 12.02.2017.
 */
import React,{PropTypes} from 'react';
import {
    Button,
    Checkbox,
    Label, Panel, Accordion
} from 'react-bootstrap';
import DatePicker from "react-datepicker";
export default class PickYourDate extends React.Component {
    render() {
        const {store}= this.context;
        const state= store.getState();
        const props = this.props;
        const footer = (<small
            id="updateDate">{' Last update: ' + new Date(props.last_update).toLocaleString('pl-PL')}</small>);
        return (<Accordion>
            <Panel header="Pick your date" footer={footer}>

                <label>{'How far in time you will travel '}
                    <input className="num_days"
                           type="number"
                           name="show_last"
                           min={0} max={62}
                           value={props.show_last}
                           step={1}
                           onChange={props.onChange}/>{' days'}
                </label>
                <Checkbox checked={props.enable_until} name="enable_until"
                          onChange={props.onChange}>{'Use date: '}
                    <DatePicker
                        selected={props.start_date}
                        dateFormat="DD/MM/YYYY"
                        onChange={props.dateChange}
                        disabled={!props.enable_until}/>
                </Checkbox>
                {(props.since !== undefined && props.until !== undefined) &&
                <div>
                    <Label
                        bsStyle="success">{`since: ` + props.since.toLocaleString('pl-PL')}</Label><br/>
                    <Label id="d_until"
                        bsStyle="danger">{`until: ` + props.until.toLocaleString('pl-PL')}</Label>
                </div>}
                <div style={{textAlign: "center"}}>
                    <Button onClick={props.updateChart} bsStyle="primary"
                            disabled={state.user.accessToken === undefined}
                    >Update</Button>
                </div>
            </Panel></Accordion>);
    }
}
PickYourDate.contextTypes={
    store:PropTypes.object.isRequired
};
PickYourDate.propTypes = {};