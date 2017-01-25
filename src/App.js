import React, {Component} from 'react';

import {Table, Button,Jumbotron} from 'react-bootstrap';
import './App.css';
import Chart from './chart';
import Header from './components/Header';
function formatDate(date){
    return new Date(date).toLocaleString('pl-PL');
}
function ChartRow(props) {
    return(<tr>
        <th>{props.index}</th>
        <th>{props.elem.from_user}</th>
        <th>{props.elem.likes_num}</th>
        <th>{formatDate(props.elem.created_time)}</th>
        <th><a href={props.elem.link}>{props.elem.link_name}</a></th>
    </tr>)
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
            until:new Date(),
            since:'',
            update_interval: updateInterval,
            chart: [],
            last_update: ''
        };
    }

    updateChart() {
        let since_date = new Date();
        since_date.setDate(this.state.until.getDate() - 14);
        let since = since_date.toISOString();
        let until_str = this.state.until.toISOString();
        console.log('update');
        this.charts.UpdateChart(since,until_str);
    }

    render() {
        let postList = this.state.chart.map((elem, id) => <ChartRow key={id} elem={elem} index={id}/>);
        return (
            <div className="App">
                <Header/>
                <Jumbotron bsClass="App-body">
                    <Button onClick={this.updateChart.bind(this)}>Update</Button>
                    <label style={{color:'red',marginLeft:'10px'}}>{' Last update: ' + formatDate(this.state.last_update)}</label>
                    <Table id="myBody" striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Likes Count</th>
                            <th>Crated Time</th>
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
