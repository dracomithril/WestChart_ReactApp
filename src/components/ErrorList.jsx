/**
 * Created by Gryzli on 29.03.2017.
 */
import React from 'react';
import {Panel} from 'react-bootstrap';
export default class ErrorList extends React.Component {
    render() {
        let err_days=this.props.error_days.map((elem)=>{
            return<div key={elem.org.getTime()}> <span  style={{color:elem.color}}>{elem.org.toDateString()}</span></div>;
        });
        return (<Panel header="Errors" bsStyle="danger">
            <strong>Date:</strong>(<span style={{color:'blue', marginRight:5}}>not enough</span><span style={{color:'red'}}>to many</span>)<br/>
            {err_days}
        </Panel>);
    }
}
ErrorList.propTypes = {};