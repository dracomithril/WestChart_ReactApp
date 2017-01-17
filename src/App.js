import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import connect from './connect';

class App extends Component {
    clickButton() {
        connect.sendRequest((data) => {
            let postList = data.map((elem, id) => {
                return (<tr key={id}>
                    <th>{elem.from.name}</th>
                    <th><a href={elem.link} >{elem.caption}</a></th>
                </tr>)
            });
            ReactDOM.render(
                <table>
                    <thead>
                    <tr>
                        <th>User</th>
                        <th>Link</th>
                    </tr>
                    </thead>
                    <tbody >
                    {postList}
                    </tbody>
                </table>,
                document.getElementById('myBody')
            );
        });
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>
                </div>

                <div>
                    <button type="button" onClick={this.clickButton.bind(this)}>Facebook</button>
                    <div id="myBody"></div>
                </div>

            </div>
        );
    }
}

export default App;
