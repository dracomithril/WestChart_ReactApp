import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Table, Button, Jumbotron, OverlayTrigger, Tooltip, Checkbox} from 'react-bootstrap';
import './App.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import Chart from './chart';
import Header from './components/Header';
function formatDate(date) {
    return new Date(date).toLocaleString('pl-PL');
}

function CreateTable(props) {
    const chart = props.chart;
    return (  <BootstrapTable data={ chart }  keyField='id' insertRow>
        <TableHeaderColumn dataField='id' autoValue>#</TableHeaderColumn>
        <TableHeaderColumn dataField='from_user' >From</TableHeaderColumn>
        <TableHeaderColumn dataField='likes_num'>Likes</TableHeaderColumn>
        <TableHeaderColumn dataField='link'>Link</TableHeaderColumn>
    </BootstrapTable>)
}
function ChartRow(props) {
    const tooltip = (
        <Tooltip id="tooltip">{props.elem.message}</Tooltip>
    );
    return (<OverlayTrigger placement="bottom" overlay={tooltip}>
        <tr>
            <th>{props.index}</th>
            <th>{props.elem.from_user}</th>
            <th>{props.elem.likes_num}</th>
            <th>{formatDate(props.elem.created_time)}</th>
            <th>{formatDate(props.elem.updated_time)}</th>
            <th><a href={props.elem.link}>{props.elem.link_name}</a></th>
        </tr>
    </OverlayTrigger>)
}
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
        this.charts = new Chart(updateInterval);
        this.charts.on('change', (cache) => {
            this.setState(cache);

        });

        this.state = {
            until: new Date(),
            since: '',
            update_interval: updateInterval,
            chart: [],
            date_control:true,
            last_update: ''
        };
    }

    createTable1() {
        ReactDOM.render(
            <CreateTable chart={this.state.chart}/>,
            document.getElementById('zombi')
        );
    }

    updateChart() {
        let since_date = new Date();
        since_date.setDate(this.state.until.getDate() - 14);
        let since = since_date.toISOString();
        let until_str = this.state.until.toISOString();
        this.setState({since:since});
        this.charts.UpdateChart(since, until_str);
    }
    date_control_change(event){
        this.setState({date_control:event.target.checked})
    }

    render() {
        let view_chart = _filterChart(this.state);
        let postList = view_chart.map((elem, id) => <ChartRow key={id} elem={elem} index={id}/>);
        return (
            <div className="App">
                <Header/>
                <Jumbotron bsClass="App-body">
                    <Checkbox checked={this.state.date_control} onChange={this.date_control_change.bind(this)}>
                        Show only posts created in last 14 days
                    </Checkbox>
                    <Button onClick={this.updateChart.bind(this)}>Update</Button>
                    <Button onClick={this.createTable1.bind(this)}>CrateTable</Button>
                    <label style={{
                        color: 'red',
                        marginLeft: '10px'
                    }}>{' Last update: ' + formatDate(this.state.last_update)}</label>
                    <div id="zombi"/>
                    <Table id="myBody" striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Likes Count</th>
                            <th>Crated Time</th>
                            <th>Last update</th>
                            <th>Link</th>
                        </tr>
                        </thead>
                        <tbody>{postList}</tbody>
                    </Table>
                </Jumbotron>
            </div>
        );
    }
}

export default App;
