import React, {Component} from 'react';
import {
    Jumbotron, PageHeader, Badge, Modal
} from 'react-bootstrap';
import ChartTable from './components/ChartTable';
//import Chart from './chart';
import Header from './components/Header';
import moment from "moment";
import qs from "querystring";
import FilteringOptions from "./components/FilteringOptions";
import SongsPerDay  from "./components/SongsPerDay";
import LoginAlert from "./components/LoginAlert";
import Footer from "./components/Footer";
import PickYourDate from './components/PickYourDate';
import MainMenu from './components/Menu';
import './App.css';
import 'react-table/react-table.css';
import 'react-datepicker/dist/react-datepicker.css';
let _ = require('lodash');
let utils = require('./utils');
let sorting = utils.sorting;
const groupId = '1707149242852457';

class App extends Component {
    constructor(props) {
        super(props);
        let updateInterval = 2;
        let showDays = 7;

        this.state = {
            access_token: undefined,
            AlertMessage: "Login to facebook to be able to do something cool",
            chart: [],
            date_added_control: true,
            date_create_control: false,
            date_update_control: false,
            enable_until: false,
            last_update: undefined,
            less_then: 15,
            less_then_control: false,
            list: [],
            list_sort: 'reaction',
            more_then: 0,
            more_then_control: false,
            reaction_count_control: false,
            show_added_in: showDays,
            show_create_list: false,
            show_created_in: showDays,
            show_hello: false,
            show_last: 31,
            show_updated_in: showDays,
            showUserInfo: false,
            since: undefined,
            songs_per_day: 2,
            start_date: moment(),
            until: new Date(),
            update_interval: updateInterval,
            user: {accessToken: undefined},
            w_o_c: true
        };
    }

    updateChart() {
        let that = this;
        let until = new Date();
        if (this.state.enable_until) {
            until = this.state.start_date.toDate()
        }
        let since = utils.subtractDaysFromDate(until, this.state.show_last);
        this.setState({
            since: since,
            until: until
        });
        let url = 'api/get_chart?' + qs.stringify({
                days: undefined,
                since: since.toISOString(),
                utils: until.toISOString(),
                access_token: this.state.access_token
            });
        console.time('client-obtain-chart');
        fetch(url).then((resp) => {
                console.log('obtained chart list');
                console.timeEnd('client-obtain-chart');
                if (resp.status === 200) {
                    return resp.json()
                }
                return Promise.reject(resp);
            }
        ).then((b) => {
            b.show_hello = false;
            that.setState(b);
        }).catch(err => {
            console.error('Error in fetch chart.');
            console.error(err);
            that.setState({show_hello: false});
        });
    }

    componentDidMount() {
    }

    handleChange(event) {
        let obj = {};
        switch (event.target.type) {
            case "checkbox":
                obj[event.target.name] = event.target.checked;
                break;
            case "number":
                obj[event.target.name] = Number(event.target.value);
                break;
            default:
                obj[event.target.name] = event.target.value;
        }
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
            let isGroupAdmin = response.groups.data.filter((elem) => elem.id === groupId && elem.administrator === true);
            if (isGroupAdmin) {
                this.setState({
                    access_token: response.accessToken,
                    user: response,
                    showUserInfo: true,
                    show_hello: true
                });
                this.updateChart();
            }
            else {
                this.setState({
                    AlertMessage: "Sorry you are not admin of this group."
                })
            }
        }
        else {
            console.error('login error.');
            console.error(response.error)
        }
    }

    render() {
        const sorting_options = Object.keys(sorting).map((elem, index) => <option key={index}
                                                                                  value={elem}>{elem.toLowerCase()}</option>);
        let {view_chart, error_days} = utils.filterChart(this.state);
        let selected = view_chart.filter((elem) => elem.selected);
        sorting[this.state.list_sort](selected);
        const create_print_list = (elem, index) => {
            return <div key={elem.id}>
                <span>{index + 1}</span>
                {`. ${elem.link.title} `}
                <Badge bsClass="likes">{elem.reactions_num + ' likes'}</Badge>
            </div>
        };
        let print_list = selected.map(create_print_list);
        return (
            <div className="App">
                <Header user={this.state.user} showUserInfo={this.state.showUserInfo}/>
                {this.state.access_token !== undefined && <MainMenu/>}
                {this.state.access_token === undefined &&
                <LoginAlert loginUser={this.LoginUserResponse.bind(this)} alertMessage={this.state.AlertMessage}/>}

                {this.state.access_token !== undefined &&
                <div>
                    <div className="formArea">

                        <SongsPerDay error_days={error_days} songs_per_day={this.state.songs_per_day}
                                     onChange={this.handleChange.bind(this)}/>
                        <PickYourDate {...this.state} onChange={this.handleChange.bind(this)}
                                      dateChange={this.dateChange.bind(this)}
                                      updateChart={this.updateChart.bind(this)}/>
                        <FilteringOptions  {...this.state} onChange={this.handleChange.bind(this)}/>
                    </div>
                    <Modal show={this.state.show_hello}>
                        <Modal.Header>{"Hello"}</Modal.Header>
                        <Modal.Body>{`Hi, ${this.state.user.first_name} we are fetching data please wait.`}</Modal.Body>
                    </Modal>
                    <Jumbotron bsClass="App-body">
                        <div>
                            <ChartTable data={view_chart} onSelectChange={this.handleListChange.bind(this)}
                                        toggle={this.toggleSelectedList.bind(this)}/>

                            <PageHeader id="list">{'List by: '}
                                <select name="list_sort" value={this.state.list_sort}
                                        onChange={this.sortList.bind(this)}>
                                    {sorting_options}
                                </select>
                            </PageHeader>
                            <div id="popover-contained" title="Print list">
                                {print_list}
                            </div>
                        </div>
                    </Jumbotron>
                </div>}
                <Footer/>
            </div>
        );
    }
}

export default App;
