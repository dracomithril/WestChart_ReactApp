/**
 * Created by Gryzli on 26.01.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import {Checkbox, Image, Label, OverlayTrigger, Tooltip} from "react-bootstrap";
import utils from "./../utils";
import "./components.css";

const action_types = require('./../reducers/action_types');

function formatDate(date) {

    const date2 = new Date(date);
    const yearNow = new Date().getFullYear();
    const options = {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    if (yearNow === date2.getFullYear()) {
        return date2.toLocaleString('pl-PL', options)
    } else {
        return date2.toLocaleString('pl-PL', {year: 'numeric', ...options});
    }
}

let getTime = function (date) {
    return new Date(date).getTime();
};
export default class ChartTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    render() {
        const {store} = this.context;
        const {user, show_wait} = store.getState();
        const {data} = this.props;
        let time = {
            Header: <i className="fa fa-clock-o">Time</i>,
            id: 'createTime',
            resizable: true,
            minWidth: 150,
            maxWidth: 200,
            accessor: d => {
                return {
                    created_time: getTime(d.created_time),
                    updated_time: getTime(d.updated_time)
                }
            },
            Cell: props => {
                const time = props.value;
                return !(time.created_time === time.updated_time) ? (<div>
                    <span style={{color: 'red'}}>c: {formatDate(time.created_time)}</span><br/>
                    <span style={{color: 'green'}}>u: {formatDate(time.updated_time)}</span>
                </div>) : (<div>
                    <span style={{color: 'red'}}>c: {formatDate(time.created_time)}</span>
                </div>)
            }
        };
        const link = {
            Header: <i className="fa fa-external-link" style={{color: 'red'}} aria-hidden="true">Link</i>, // Custom header components!
            accessor: d => d.link,
            minWidth: 200,
            width: 300,
            maxWidth: 400,
            id: 'yt_link',
            Cell: props => {
                return props.value.url === undefined ? (<span>{props.value.title}</span>) : (
                    <a href={props.value.url} target="_newtab">{props.value.title}</a>)
            }
        };
        let post_info = {
            Header: 'Post Info',
            columns: [
                {
                    Header: <i className="fa fa-user-circle" style={{color: 'green'}} aria-hidden="true">user</i>,
                    resizable: true,
                    minWidth: 140,
                    maxWidth: 180,
                    id: 'user',
                    accessor: 'from', // String-based value accessors !
                    Cell: props => {
                        const from = props.value;
                        return <div style={{textAlign: 'left'}}>
                            <Image style={{float: 'left'}} src={utils.getFbPictureUrl(from.id)}/>
                            <div style={{display: 'inline-grid'}}>
                                <span style={{paddingLeft: 10}}>{from.first_name}</span>
                                <span style={{paddingLeft: 10}}>{from.last_name}</span>
                            </div>
                        </div>
                    }
                }, {
                    Header: <i className="fa fa-info-circle" style={{color: 'blue'}} aria-hidden="true"/>,
                    accessor: d => {
                        return {message: d.message, reactions_num: d.reactions_num}
                    },
                    id: 'woc_f',
                    maxWidth: 50,
                    Cell: props => {
                        const condition = props.value && props.value.message;
                        return <div>
                            {(condition) &&
                            <OverlayTrigger placement="bottom" overlay={<Tooltip
                                id="tooltip">{props.value.message}</Tooltip>}>
                                <Label bsStyle="success">
                                    <i className="fa fa-envelope-o" aria-hidden="true"/>
                                </Label>
                            </OverlayTrigger>
                            }
                            {(!condition) &&
                            <Label bsStyle="danger"><i className="fa fa-times" aria-hidden="true"/></Label>}
                            <div>
                                <i className="fa fa-thumbs-o-up" style={{color: 'blue'}}
                                   aria-hidden="true"/>{props.value.reactions_num}
                            </div>
                        </div>
                    }
                }, time, link]
        };


        const columns = [{
            Header: 'id',
            show: false,
            accessor: 'id',
        }, {
            Header: <small>{data.length}</small>,
            columns: [{
                sortable: false,
                resizable: false,
                Header: () => <Checkbox bsClass="checkbox1" onClick={() => {
                    store.dispatch({type: action_types.TOGGLE_ALL})
                }}/>,
                width: 40,
                accessor: 'selected',
                Cell: props => {
                    return <Checkbox bsClass="checkbox1" checked={props.value} id={props.row.id}
                                     name="selected"
                                     onChange={(e) => {
                                         store.dispatch({
                                             type: 'TOGGLE_SELECTED', id: e.target.id,
                                             checked: e.target.checked
                                         })
                                     }}/>
                }
            }]
        }, post_info];
        const tableOptions = {
            filterable: false,
            // filtered:[{id:'woc_f'},{id:'user'}],
            resizable: false,
            pageSizeOptions: [20, 50, 100],

        };
        return (<ReactTable data={data} className="-striped -highlight" {...tableOptions}
                            columns={columns} defaultPageSize={20} minRows={10} loading={show_wait}
                            noDataText={<span>{`Hi, ${user.first_name} please click `}<strong style={{color: "blue"}}>Update</strong>{` to start.`}</span>}
        />);
    }
}
ChartTable.contextTypes = {
    store: PropTypes.object
};
ChartTable.propTypes = {
    data: PropTypes.array,
};