/**
 * Created by Gryzli on 25.01.2017.
 */
import React from 'react';
import logo from './starter.png';
export default class Header extends React.Component {
    render() {
        return (<div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
        </div>);
    }
}
Header.propTypes={

};