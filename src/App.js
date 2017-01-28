import React, {Component} from 'react';
import {
    Button,
    Jumbotron,
    Checkbox,
    Label,
    ButtonGroup
} from 'react-bootstrap';
import ChartTable from './components/ChartTable';
import Chart from './chart';
import Header from './components/Header';
import DatePicker from "react-datepicker";
import moment from "moment";
import MusicChartList from "./components/MusicChartList";
import FilteringOptions from "./components/FilteringOptions";
import LoginAlert from "./components/LoginAlert";
import './App.css';
import 'react-table/react-table.css';
import 'react-datepicker/dist/react-datepicker.css';
let _ = require('lodash');
let utils= require('./utils');


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
            date_create_control: false,
            date_update_control: false,
            enable_until: false,
            last_update: undefined,
            list: [],
            show_create_list: false,
            show_last: showDays,
            show_created_in: showDays,
            show_updated_in: showDays,
            showUserInfo: false,
            since: undefined,
            start_date: moment(),
            until: new Date(),
            update_interval: updateInterval,
            user: {accessToken: undefined},
            w_o_c: true
        };
    }

    updateChart() {
        let until = new Date();
        if (this.state.enable_until) {
            until = this.state.start_date.toDate()
        }
        let since = utils.subtractDaysFromDate(until, this.state.show_last);
        this.setState({
            since: since,
            until: until
        });
        this.charts.UpdateChart(since.toISOString(), until.toISOString(), this.state.access_token);
    }

    componentDidMount() {
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

    LoginUserResponse(response) {
        if (!response.error) {
            this.setState({
                access_token: response.accessToken,
                user: response,
                showUserInfo: true
            });
            this.updateChart();
        }
    }

    render() {
        let view_chart = utils.filterChart(this.state);
        return (
            <div className="App">
                <Header user={this.state.user} showUserInfo={this.state.showUserInfo}/>
                <Jumbotron bsClass="App-body">
                    {this.state.access_token === undefined &&
                    <LoginAlert loginUser={this.LoginUserResponse.bind(this)}/>}
                    {this.state.access_token !== undefined &&
                    <div>

                        <div className="formArea">
                            <FilteringOptions state={this.state}
                                              onChange={this.handleChange.bind(this)} woc_string={utils.woc_string}/>
                            <div>
                                <label>
                                    {'How far in time you will travel '}<input className="num_days" type="number"
                                                                               name="show_last"
                                                                               min={0} max={31}
                                                                               value={this.state.show_last} step={1}
                                                                               onChange={this.handleChange.bind(this)}/>{' days'}
                                </label>
                                <Checkbox checked={this.state.enable_until} name="enable_until"
                                          onChange={this.handleChange.bind(this)}>{'Use date: '}
                                    <DatePicker
                                        selected={this.state.start_date}
                                        dateFormat="DD/MM/YYYY"
                                        onChange={this.dateChange.bind(this)}
                                        disabled={!this.state.enable_until}/></Checkbox>
                                {(this.state.since !== undefined && this.state.until !== undefined) &&
                                <div>
                                    <Label
                                        bsStyle="success">{`since: ` + this.state.since.toLocaleString('pl-PL')}</Label>
                                    <Label
                                        bsStyle="danger">{`until: ` + this.state.until.toLocaleString('pl-PL')}</Label>
                                </div>}
                                <ButtonGroup>
                                    <Button onClick={this.updateChart.bind(this)} bsStyle="primary"
                                            disabled={this.state.access_token === undefined}>Update</Button>
                                    <Button bsStyle="danger" onClick={() => this.openMusicChart.call(this, view_chart)}>Create
                                        title list</Button>
                                </ButtonGroup>

                            </div>
                        </div>
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
                <div className="footer">
                    <span >{'site created by '}<a href="https://github.com/dracomithril">dracomithril</a>{' © Copyright 2017'}</span><br/>
                    <span>For any problems <a href="mailto:dracomithril@gmail.com?subject=[WCSChartA]">contact me</a></span>
                </div>
            </div>
        );
    }
}

export default App;
