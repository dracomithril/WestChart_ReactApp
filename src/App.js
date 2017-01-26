import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import {Button, Jumbotron, Checkbox, Label, ButtonGroup} from 'react-bootstrap';
import './App.css';
import ChartTable from './components/ChartTable';
import Chart from './chart';
import Header from './components/Header';
import 'react-table/react-table.css';
import DatePicker from "react-datepicker";
import moment from "moment";
import 'react-datepicker/dist/react-datepicker.css';
/**
 *
 * @param state
 * @returns {Array}
 * @private
 */
function _filterChart(state) {
    let view_chart = [];
    if (state.date_control) {
        let d2 = state.since.getTime();
        view_chart = state.chart.filter((elem) => {
            let d1 = new Date(elem.created_time).getTime();
            let result = d1 - d2;
            return result > 0;
        });
    }
    else {
        view_chart = state.chart;
    }
    return view_chart;
}


class App extends Component {
    constructor(props) {
        super(props);
        let updateInterval = 2;
        let showDays = 14;

        this.charts = new Chart(updateInterval, showDays);
        this.charts.on('change', (cache) => {
            this.setState(cache);
        });

        this.state = {
            show_last: showDays,
            until: new Date(),
            since: undefined,
            update_interval: updateInterval,
            chart: [],
            enable_until: false,
            start_date: moment(),
            date_control: false,
            last_update: undefined
        };
    }

    updateChart() {
        let until = new Date();
        if (this.state.enable_until) {
            until = this.state.start_date.toDate()
        }
        let until_str = until.toISOString();
        let since_date = new Date(until_str);
        since_date.setDate(until.getDate() - this.state.show_last);
        let since = since_date.toISOString();
        this.setState({
            since: since_date,
            until: until
        });
        this.charts.UpdateChart(since, until_str);
    }

    date_control_change(event) {
        this.setState({date_control: event.target.checked})
    }

    enable_until_change(event) {
        this.setState({enable_until: event.target.checked})
    }

    componentDidMount() {
        this.updateChart();
    }

    handleChange(event) {
        let obj = {};
        obj[event.target.name] = event.target.value;
        this.setState(obj);
    }

    dateChange(date) {
        this.setState({
            start_date: date,
        });
    }

    render() {
        let view_chart = _filterChart(this.state);
        return (
            <div className="App">
                <Header/>
                <Jumbotron bsClass="App-body">
                    <Checkbox checked={this.state.date_control} onChange={this.date_control_change.bind(this)}>
                        {'Show only posts created in last '}<input className="num_days" type="number" name="show_last"
                                                                   min={0} max={31}
                                                                   value={this.state.show_last} step={1}
                                                                   onChange={this.handleChange.bind(this)}/>{' days'}
                    </Checkbox>
                    <Checkbox checked={this.state.enable_until} onChange={this.enable_until_change.bind(this)}>Use date:<DatePicker
                        selected={this.state.start_date}
                        dateFormat="DD/MM/YYYY"
                        onChange={this.dateChange.bind(this)} disabled={!this.state.enable_until}/></Checkbox>
                    <ButtonGroup>
                        <Button onClick={this.updateChart.bind(this)} bsStyle="primary">Update</Button>
                        <Button bsStyle="danger" disabled>Create title list</Button>
                    </ButtonGroup><span>{this.state.since!==undefined&&<Label
                    bsStyle="success">{this.state.since.toLocaleString('pl-PL')}</Label>}
                    <Label bsStyle="danger">{this.state.until.toLocaleString('pl-PL')}</Label></span>
                    {(this.state.last_update !== undefined) &&
                    <div>
                        <Label bsStyle="info">{'Total '}<strong
                            style={{color: 'green'}}>{view_chart.length}</strong></Label>
                        <label style={{
                            color: 'red',
                            marginLeft: '10px'
                        }}>{' Last update: ' + new Date(this.state.last_update).toLocaleString('pl-PL')}</label></div>}
                    <ChartTable data={view_chart}/>
                </Jumbotron>
            </div>
        );
    }
}

export default App;
