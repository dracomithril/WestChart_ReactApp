import React, {Component} from 'react';
import {
    Button,
    Jumbotron,
    Checkbox,
    Label,
    ButtonGroup,
    PageHeader
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
let utils = require('./utils');
let sorting = {
    reaction: (array) => {
        array.sort((a, b) => b.reactions - a.reactions)
    },
    who: (array) => {
        array.sort((a, b) => {
            if (a.who < b.who)
                return -1;
            if (a.who > b.who)
                return 1;
            return 0;
        });

    },
    when: (array) => {
        array.sort((a, b) => b.when.getTime() - a.when.getTime());
    },
    what: (array) => {
        array.sort((a, b) => {
            if (a.title < b.title)
                return -1;
            if (a.title > b.title)
                return 1;
            return 0;
        });
    }
};


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
            date_added_control: false,
            date_create_control: false,
            date_update_control: false,
            enable_until: false,
            last_update: undefined,
            less_then: 15,
            reaction_count_control: false,
            list: [],
            list_sort: 'reaction',
            show_create_list: false,
            show_last: showDays,
            show_added_in: showDays,
            show_created_in: showDays,
            show_updated_in: showDays,
            more_then: 0,
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

    toggleSelectedList() {
        let selectAllList = this.state.list.map((elem) => {
            let copy = _.clone(elem);
            copy.selected = !elem.selected;
            return copy
        });
        this.setState({list: selectAllList});
    }

    openMusicChart(chart) {
        let c = _.clone(chart);
        let list = c.map((elem, index) => {
            return {
                selected: false,
                id: index,
                when: elem.added_time,
                likes: elem.likes_num,
                reactions: elem.reactions_num,
                who: elem.from_user,
                title: elem.link.name
            }
        });
        sorting[this.state.list_sort](list);
        //list.sort((a, b) => b.reactions - a.reactions);
        this.setState({
            list: list,
            show_create_list: true
        })
    }

    sortList(event) {
        let sort_by = event.target.value;
        let list = _.clone(this.state.list);
        sorting[sort_by](list);
        this.setState({
            list: list,
            list_sort: sort_by
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
        let list = view_chart.map((elem, index) => {
            return {
                selected: false,
                id: index,
                when: elem.added_time,
                likes: elem.likes_num,
                reactions: elem.reactions_num,
                who: elem.from_user,
                title: elem.link.name
            }
        });
        // sorting[this.state.list_sort](list);
        // //list.sort((a, b) => b.reactions - a.reactions);
        // this.setState({
        //     list: list,
        //     show_create_list: true
        // });
        return (
            <div className="App">
                <Header user={this.state.user} showUserInfo={this.state.showUserInfo}/>
                {this.state.access_token !== undefined &&
                <FilteringOptions  {...this.state} onChange={this.handleChange.bind(this)}/>}
                <div>
                    {this.state.access_token === undefined &&
                    <LoginAlert loginUser={this.LoginUserResponse.bind(this)}/>}
                    {this.state.access_token !== undefined &&
                    <Jumbotron bsClass="App-body">
                        <div>
                            <div className="formArea">
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
                                                disabled={this.state.access_token === undefined}
                                                bsSize="large">Update</Button>
                                        <Button bsStyle="danger"
                                                onClick={() => this.openMusicChart.call(this, view_chart)}
                                                bsSize="large">Create
                                            title list</Button>
                                    </ButtonGroup>
                                </div>

                            </div>


                            {(this.state.last_update !== undefined) &&
                            <div>
                                <PageHeader id="charttable">Chart Table</PageHeader>
                                <Label bsStyle="info">{'Total '}<strong
                                    style={{color: 'green'}}>{view_chart.length}</strong></Label>
                                <label style={{
                                    color: 'red',
                                    marginLeft: '10px'
                                }}>{' Last update: ' + new Date(this.state.last_update).toLocaleString('pl-PL')}</label>
                                <ChartTable data={view_chart}/>

                                <MusicChartList constainer={this} show={this.state.show_create_list}
                                                list={list}
                                                sorting_options={Object.keys(sorting)} sort={this.sortList.bind(this)}
                                                close={() => this.setState({show_create_list: false})}
                                                sort_by={this.state.list_sort}
                                                onListChange={this.handleListChange.bind(this)}
                                                toggle={this.toggleSelectedList.bind(this)}/>

                            </div>}
                        </div>
                    </Jumbotron>}
                </div>
                <footer className="footer">
                    <span >{'site created by '}<a
                        href="https://github.com/dracomithril">dracomithril</a>{' © Copyright 2017'}</span><br/>
                    <span>{'Any questions? '}<a
                        href="mailto:dracomithril@gmail.com?subject=[WCSChartAdmin]">contact me</a></span>
                </footer>
            </div>
        );
    }
}

export default App;
