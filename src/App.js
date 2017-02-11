import React, {Component} from 'react';
import {
    Button,
    Jumbotron,
    Checkbox,
    Label, Navbar, NavItem, Nav,
    PageHeader, Badge, FormControl
} from 'react-bootstrap';
import ChartTable from './components/ChartTable';
import Chart from './chart';
import Header from './components/Header';
import DatePicker from "react-datepicker";
import moment from "moment";
import FilteringOptions from "./components/FilteringOptions";
import LoginAlert from "./components/LoginAlert";
import './App.css';
import 'react-table/react-table.css';
import 'react-datepicker/dist/react-datepicker.css';
let _ = require('lodash');
let utils = require('./utils');
let sorting = {
    reaction: (array) => {
        array.sort((a, b) => b.reactions_num - a.reactions_num)
    },
    who: (array) => {
        array.sort((a, b) => {
            if (a.from_user < b.from_user)
                return -1;
            if (a.from_user > b.from_user)
                return 1;
            return 0;
        });

    },
    when: (array) => {
        array.sort((a, b) => b.added_time.getTime() - a.added_time.getTime());
    },
    what: (array) => {
        array.sort((a, b) => {
            if (a.link.name < b.link.name)
                return -1;
            if (a.link.name > b.link.name)
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
        let l = _.clone(this.state.chart);
        let element = l[event.target.id];
        element.selected = event.target.checked;
        this.setState({chart: l});
    }

    toggleSelectedList() {
        let selectAllList = this.state.chart.map((elem) => {
            let copy = _.clone(elem);
            copy.selected = !elem.selected;
            return copy
        });
        this.setState({chart: selectAllList});
    }

    sortList(event) {
        let sort_by = event.target.value;
        // let list = _.clone(this.state.list);
        // sorting[sort_by](list);
        this.setState({
            // list: list,
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
        const sorting_options = Object.keys(sorting).map((elem, index) => <option key={index}
                                                                                  value={elem}>{elem.toLowerCase()}</option>);
        let view_chart = utils.filterChart(this.state);
        let selected = view_chart.filter((elem) => elem.selected);
        sorting[this.state.list_sort](selected);
        let print_list = selected.map((elem, index) => {
            return <div key={elem.id}>
                <span>{index + 1}</span>
                {`. ${elem.link.name} `}
                <Badge bsClass="likes">{elem.reactions_num + ' likes'}</Badge>
            </div>
        });
        return (
            <div className="App">
                <Header user={this.state.user} showUserInfo={this.state.showUserInfo}/>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">Chart</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <NavItem eventKey={1} href="#chart_table">Chart table</NavItem>
                        <NavItem eventKey={2} href="#list">List</NavItem>
                    </Nav>
                </Navbar>
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
                                    <Button onClick={this.updateChart.bind(this)} bsStyle="primary"
                                            disabled={this.state.access_token === undefined}
                                            bsSize="large">Update</Button>
                                </div>
                            </div>


                            {(this.state.last_update !== undefined) &&
                            <div>
                                <PageHeader id="chart_table">Chart Table</PageHeader>
                                <Label bsStyle="info">{'Total '}<strong
                                    style={{color: 'green'}}>{view_chart.length}</strong></Label>
                                <label style={{
                                    color: 'red',
                                    marginLeft: '10px'
                                }}>{' Last update: ' + new Date(this.state.last_update).toLocaleString('pl-PL')}</label>
                                <ChartTable data={view_chart} onSelectChange={this.handleListChange.bind(this)}
                                            toggle={this.toggleSelectedList.bind(this)}/>

                                <PageHeader id="list">List</PageHeader>
                                <FormControl componentClass="select" placeholder="select" name="list_sort"
                                             value={this.state.list_sort} onChange={this.sortList.bind(this)}>
                                    {sorting_options}
                                </FormControl>
                                <div id="popover-contained" title="Print list">
                                    {print_list}
                                </div>

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
