import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import {Button, Jumbotron, Checkbox, Label, OverlayTrigger, Tooltip} from 'react-bootstrap';
import './App.css';
import ReactTable from 'react-table';
import Chart from './chart';
import Header from './components/Header';
import 'react-table/react-table.css';
function formatDate(date) {
    let date2 = new Date(date);
    return date2.toLocaleString('pl-PL');
}
const columns = [{
    header: 'WCS Chart',
    columns: [
        {
            header: 'user',
            minWidth:200,
            maxWidth:300,
            accessor: 'from_user', // String-based value accessors !
            render: props => <span>{props.value}</span>
        }, {
            header: 'fb msg',
            accessor: 'message',
            maxWidth: 80,
            render: props => {
                if (props.value !== undefined) {
                    return <OverlayTrigger placement="bottom" overlay={<Tooltip
                        id="tooltip">{props.value}</Tooltip>}><Label
                        bsStyle="success">(...msg...)</Label></OverlayTrigger>
                }
                return <Label bsStyle="danger">no msg</Label>
            }
        }, {
            header: 'likes Count',
            accessor: 'likes_num',
            minWidth: 60,
            maxWidth: 120
        }, {
            header: 'crated time',
            id: 'createTime',
            maxWidth: 200,
            accessor: d => {
                return d.created_time.getTime()
            },
            render: props => <span>{formatDate(props.value)}</span>
        }, {
            header: 'last update',
            id: 'lastUpdate',
            maxWidth: 200,
            accessor: d => {
                return d.updated_time.getTime()
            },
            render: props => <span>{formatDate(props.value)}</span>
        }, {
            header: props => <span>link</span>, // Custom header components!
            accessor: d => d.link.name,
            id: 'yt_link',
            render: props => {
                return (<a href={props.row.link.url}>{props.value}</a>)
            }
        }
    ]
}
];

/**
 *
 * @param state
 * @returns {Array}
 * @private
 */
function _filterChart(state) {
    let view_chart = [];
    if (state.date_control) {
        let d2 = new Date(state.since).getTime();
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
            date_control: false,
            last_update: undefined
        };
    }

    updateChart() {
        let until = new Date();
        let since_date = new Date();
        since_date.setDate(this.state.until.getDate() - this.state.show_last);
        let since = since_date.toISOString();
        let until_str = until.toISOString();
        this.setState({since: since});
        this.charts.UpdateChart(since, until_str);
    }

    date_control_change(event) {
        this.setState({date_control: event.target.checked})
    }

    componentDidMount() {
        this.updateChart();
    }

    handleChange(event) {
        let obj = {};
        obj[event.target.name] = event.target.value;
        this.setState(obj);
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
                    <Button onClick={this.updateChart.bind(this)} bsStyle="primary">Update</Button>
                    {(this.state.last_update !== undefined) &&
                    <div>
                        <Label bsStyle="info">{'Total '}<strong
                            style={{color: 'green'}}>{view_chart.length}</strong></Label>
                        <label style={{
                            color: 'red',
                            marginLeft: '10px'
                        }}>{' Last update: ' + formatDate(this.state.last_update)}</label></div>}
                    <ReactTable data={view_chart}
                                columns={columns} defaultPageSize={50}/>
                </Jumbotron>
            </div>
        );
    }
}

export default App;
