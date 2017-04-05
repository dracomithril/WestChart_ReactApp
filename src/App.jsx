import React, {Component, PropTypes} from "react";
import {Badge, Jumbotron, Modal, PageHeader} from "react-bootstrap";
import ChartTable from "./components/ChartTable";
import Header from "./components/Header";
import moment from "moment";
import qs from "querystring";
import FilteringOptions from "./components/FilteringOptions";
import SongsPerDay from "./components/SongsPerDay";
import LoginAlert from "./components/LoginAlert";
import Footer from "./components/Footer";
import PickYourDate from "./components/PickYourDate";
import MainMenu from "./components/Menu";
import CookieBanner from "react-cookie-banner";
import "./App.css";
import "react-table/react-table.css";
import "react-datepicker/dist/react-datepicker.css";
let _ = require('lodash');
let utils = require('./utils');
let sorting = utils.sorting;
const groupId = '1707149242852457';

let get_chart_from_server = function (query_params, updateStoreChart) {
    let url = 'api/get_chart?' + qs.stringify(query_params);
    console.time('client-obtain-chart');
    fetch(url).then((resp) => {
            console.log('obtained chart list');
            console.timeEnd('client-obtain-chart');
            if (resp.status === 200) {
                return resp.json()
            }
            return Promise.reject(resp);
        }
    ).then(updateStoreChart
    ).catch(err => {
        console.error('Error in fetch chart.');
        console.error(err);
    });
};
class App extends Component {
    constructor(props) {
        super(props);
        let showDays = 7;
        this.state = {
            chart: [],
            enable_until: false,
            last_update: undefined,
            list_sort: 'reaction',
            show_last: 31,
            since: undefined,
            songs_per_day: 2,
            start_date: moment(),
            until: new Date()
        };
    }


    componentWillUnmount() {
        this.unsubscribe();
    }

    updateChart() {
        const {store}= this.context;
        const state= store.getState();
        let that = this;
        let until = new Date();
        const state2 = this.state;
        if (state2.enable_until) {
            until = state2.start_date.toDate()
        }
        let since = utils.subtractDaysFromDate(until, state2.show_last);
        const since2 = since.toISOString();
        this.setState({
            since: since2,
            until: until.toISOString()
        });
        const updateStoreChart = (b) =>{
            that.setState(b)
// store.dispatch({})
        };


        const utils2 = until.toISOString();
        const query_params = {
            days: undefined,
            since: since2,
            utils: utils2,
            access_token: state.user.accessToken
        };
        get_chart_from_server(query_params, updateStoreChart);
    }

    componentDidMount() {
        const {store} = this.context;
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
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
        this.setState({
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
                this.updateChart();
            }
        }
        else {
            console.error('login error.');
            console.error(response.error)
        }
    }

    render() {
        const {store} = this.context;
        const state = this.state;
        const userInfo = store.getState().user;
        const sorting_options = Object.keys(sorting)
            .map((elem, index) => <option key={index} value={elem}>{elem.toLowerCase()}</option>);
        let view_chart1=[], error_days1=[];
        if(state.chart.length>0){
        let {view_chart, error_days} = utils.filterChart(state,store);
            view_chart1=view_chart;
            error_days1=error_days;
        }
        let selected = view_chart1.filter((elem) => elem.selected);
        sorting[state.list_sort](selected);
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
                <div>
                    <CookieBanner
                        message={'Yes, we use cookies. If you don\'t like it change website, we won\'t miss you! ;)'}
                        onAccept={() => {
                        }}
                        cookie='user-has-accepted-cookies'/>
                </div>
                <Header/>
                {userInfo.isGroupAdmin && <MainMenu/>}
                {!userInfo.isGroupAdmin &&
                <LoginAlert />}
                {userInfo.isGroupAdmin &&
                <div>
                    <div className="formArea">
                        <SongsPerDay error_days={error_days1} songs_per_day={state.songs_per_day}
                                     onChange={this.handleChange.bind(this)}/>
                        <PickYourDate {...state} onChange={this.handleChange.bind(this)}
                                      dateChange={this.dateChange.bind(this)}
                                      updateChart={this.updateChart.bind(this)}/>
                        <FilteringOptions />
                    </div>
                    <Modal show={false/*state.chart.length === 0*/}>
                        <Modal.Header>{"Hello"}</Modal.Header>
                        <Modal.Body>{`Hi, ${userInfo.first_name} we are fetching data please wait.`}</Modal.Body>
                    </Modal>
                    <Jumbotron bsClass="App-body">
                        <div>
                            <ChartTable data={view_chart1} onSelectChange={this.handleListChange.bind(this)}
                                        toggle={this.toggleSelectedList.bind(this)}/>

                            <PageHeader id="list">{'List by: '}
                                <select name="list_sort" value={state.list_sort}
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
App.contextTypes = {
    store: PropTypes.object
};
export default App;
