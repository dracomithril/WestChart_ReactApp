import React, {Component} from 'react';
import {
    Button,
    Jumbotron,
    Checkbox,
    Label,
    ButtonGroup,
    Alert
} from 'react-bootstrap';
import ChartTable from './components/ChartTable';
import Chart from './chart';
import Header from './components/Header';
import DatePicker from "react-datepicker";
import moment from "moment";
import MusicChartList from "./components/MusicChartList";
import FilteringOptions from "./components/FilteringOptions";
import './App.css';
import 'react-table/react-table.css';
import 'react-datepicker/dist/react-datepicker.css';
let _ = require('lodash');
const woc_string = "Wielkie Ogarnianie Charta";

/**
 *
 * @param state
 * @returns {Array}
 * @private
 */
function _filterChart(state) {
    let view_chart = state.chart;
    if (state.date_create_control) {
        let s1d = new Date(state.until.toISOString());
        s1d.setDate(state.until.getDate() - state.show_created_in);
        let d2 = s1d.getTime();
        view_chart = view_chart.filter((elem) => {
            let d1 = new Date(elem.created_time).getTime();
            let result = d1 - d2;
            return result > 0;
        });
    }
    if (state.date_update_control) {
        let s1d = new Date(state.until.toISOString());
        s1d.setDate(state.until.getDate() - state.show_updated_in);
        let d2 = s1d.getTime();
        view_chart = view_chart.filter((elem) => {
            let d1 = new Date(elem.updated_time).getTime();
            let result = d1 - d2;
            return result > 0;
        });
    }
    if (!state.w_o_c) {
        view_chart = view_chart.filter((elem) => {
            return elem.message !== undefined ? !elem.message.includes(woc_string) : true;
        })
    }
    return view_chart;
}
function LoginAlert() {
    return(<Alert bsStyle="danger">
        <h4>Oh snap! You got an error!</h4>
        <p>Login to facebook to be able to do something cool</p>
    </Alert>)
}
class App extends Component {
    constructor(props) {
        super(props);
        let updateInterval = 2;
        let showDays = 7;

        this.charts = new Chart(updateInterval, showDays);
        this.charts.on('change', (cache) => {
            this.setState(cache);
        });

        this.state = {
            access_token: undefined,
            chart: [],
            w_o_c: true,
            date_create_control: false,
            date_update_control: false,
            enable_until: false,
            last_update: undefined,
            list: [],
            show_create_list: false,
            show_last: showDays,
            show_created_in: showDays,
            show_updated_in: showDays,
            since: undefined,
            start_date: moment(),
            until: new Date(),
            update_interval: updateInterval
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
        this.charts.UpdateChart(since, until_str, this.state.access_token);
    }

    componentDidMount() {
        // this.updateChart();
    }

    handleChange(event) {
        let obj = {};
        obj[event.target.name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState(obj);
    }

    handleListChange(event) {
        let l = _.clone(this.state.list);
        l[event.target.name].selected = event.target.checked;
        this.setState({list: l});
    }

    openMusicChart(chart) {
        let c = _.clone(chart);
        c.sort((a, b) => b.likes_num - a.likes_num);
        let list = c.map((elem, index) => {
            return {
                selected: false,
                id: index,
                likes: elem.likes_num,
                who: elem.from_user,
                title: elem.link.name
            }
        });
        this.setState({
            list: list,
            show_create_list: true
        })
    }

    dateChange(date) {
        this.setState({
            start_date: date,
        });
    }

    updateToken(token) {
        this.setState({access_token: token});
        this.updateChart();
    }

    render() {
        let view_chart = _filterChart(this.state);


        return (
            <div className="App">
                <Header user={this.state.user} updateToken={this.updateToken.bind(this)}/>
                <Jumbotron bsClass="App-body">
                    {this.state.access_token === undefined && <LoginAlert/>}
                    {this.state.access_token !== undefined &&
                    <div>

                        <form className="formArea">
                            <FilteringOptions state={this.state}
                                              onChange={this.handleChange.bind(this)} woc_string={woc_string}/>
                            <div>
                                <label>
                                    {'How far in time you will travel '}<input className="num_days" type="number"
                                                                               name="show_last"
                                                                               min={0} max={31}
                                                                               value={this.state.show_last} step={1}
                                                                               onChange={this.handleChange.bind(this)}/>{' days'}
                                </label>
                                <Checkbox checked={this.state.enable_until} name="enable_until"
                                          onChange={this.handleChange.bind(this)}>Use
                                    date:<DatePicker
                                        selected={this.state.start_date}
                                        dateFormat="DD/MM/YYYY"
                                        onChange={this.dateChange.bind(this)}
                                        disabled={!this.state.enable_until}/></Checkbox>

                                <ButtonGroup>
                                    <Button onClick={this.updateChart.bind(this)} bsStyle="primary"
                                            disabled={this.state.access_token === undefined}>Update</Button>
                                    <Button bsStyle="danger" onClick={() => this.openMusicChart.call(this, view_chart)}>Create
                                        title list</Button>
                                </ButtonGroup><span>{this.state.since !== undefined && <Label
                                bsStyle="success">{this.state.since.toLocaleString('pl-PL')}</Label>}
                                <Label bsStyle="danger">{this.state.until.toLocaleString('pl-PL')}</Label></span>
                            </div>
                        </form>

                        <MusicChartList constainer={this} show={this.state.show_create_list} list={this.state.list}
                                        close={() => this.setState({show_create_list: false})}
                                        onListChange={this.handleListChange.bind(this)}/>
                        {(this.state.last_update !== undefined) &&
                        <div>
                            <Label bsStyle="info">{'Total '}<strong
                                style={{color: 'green'}}>{view_chart.length}</strong></Label>
                            <label style={{
                                color: 'red',
                                marginLeft: '10px'
                            }}>{' Last update: ' + new Date(this.state.last_update).toLocaleString('pl-PL')}</label>
                        </div>}
                        <ChartTable data={view_chart}/>
                    </div>}
                </Jumbotron>
            </div>
        );
    }
}

export default App;
