/**
 * Created by Gryzli on 12.02.2017.
 */
import React from 'react';
import {
    Button,
    Checkbox,
    Label, Panel, Accordion
} from 'react-bootstrap';
import DatePicker from "react-datepicker";
export default class PickYourDate extends React.Component {
    render() {
        const footer = (<small
            id="updateDate">{' Last update: ' + new Date(this.props.last_update).toLocaleString('pl-PL')}</small>);
        return (<Accordion>
            <Panel header="Pick your date" footer={footer}>
                <label>{'How far in time you will travel '}
                    <input className="num_days"
                           type="number"
                           name="show_last"
                           min={0} max={62}
                           value={this.props.show_last}
                           step={1}
                           onChange={this.props.onChange}/>{' days'}
                </label>
                <Checkbox checked={this.props.enable_until} name="enable_until"
                          onChange={this.props.onChange}>{'Use date: '}
                    <DatePicker
                        selected={this.props.start_date}
                        dateFormat="DD/MM/YYYY"
                        onChange={this.props.dateChange}
                        disabled={!this.props.enable_until}/>
                </Checkbox>
                {(this.props.since !== undefined && this.props.until !== undefined) &&
                <div>
                    <Label
                        bsStyle="success">{`since: ` + this.props.since.toLocaleString('pl-PL')}</Label><br/>
                    <Label id="d_until"
                        bsStyle="danger">{`until: ` + this.props.until.toLocaleString('pl-PL')}</Label>
                </div>}
                <div style={{textAlign: "center"}}>
                    <Button onClick={this.props.updateChart} bsStyle="primary"
                            disabled={this.props.access_token === undefined}
                    >Update</Button>
                </div>
            </Panel></Accordion>);
    }
}
PickYourDate.propTypes = {};