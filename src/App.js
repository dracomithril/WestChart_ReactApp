import React, {Component} from 'react';
import logo from './starter.png';
import {Table} from 'react-bootstrap';
import './App.css';
import Chart from './chart';


class App extends Component {
    constructor(props) {
        super(props);
        let updateInterval = 2;
        this.cache = new Chart(updateInterval);
        this.cache.on('change', (cache) => {
            this.setState(cache);
        });

        this.state = {
            update_interval:updateInterval,
            chart: [],
            last_update: ''
        };
    }

    render() {
        let postList = this.state.chart.map((elem, id) => {
            return (<tr key={id}>
                <th>{elem.from_user}</th>
                <th>{elem.likes_num}</th>
                <th><a href={elem.link}>{elem.link_name}</a></th>
            </tr>)
        });
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </div>
                <label>{'List updates each '}<h4>{this.state.update_interval +' h'}</h4>{' Last update: '+this.state.last_update}</label>
                <div>
                    <Table id="myBody" striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th>User</th>
                            <th>Likes Count</th>
                            <th>Link</th>
                        </tr>
                        </thead>
                        <tbody>{postList}</tbody>
                    </Table>

                </div>

            </div>
        );
    }
}

export default App;
