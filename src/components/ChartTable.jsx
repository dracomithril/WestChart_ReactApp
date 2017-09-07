/**
 * Created by Gryzli on 26.01.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import {Checkbox, Image, Label, OverlayTrigger, Tooltip} from "react-bootstrap";

import "./components.css";
const action_types = require('./../reducers/action_types');
function formatDate(date) {
    return new Date(date).toLocaleString('pl-PL');
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
        const isMobile = false;
        const {store} = this.context;
        const {user, show_wait} = store.getState();
        const {data} = this.props;
        let post_info = {
            Header: 'Post Info',
            columns: [
                {
                    Header: <i className="fa fa-user-circle" style={{color: 'green'}} aria-hidden="true">user</i>,
                    resizable: true,
                    minWidth: 140,
                    maxWidth: 300,
                    id: 'user',
                    accessor: 'from', // String-based value accessors !
                    Cell: props => {
                        return <div style={{textAlign:'left'}}>
                             <Image src={`https://graph.facebook.com/v2.9/${props.value.id}/picture`}/>
                            <span style={{paddingLeft:10}}>{props.value.name}</span>
                        </div>
                    }
                }, {
                    Header: <i className="fa fa-envelope-o" style={{color: 'orange'}} aria-hidden="true"/>,
                    accessor: 'message',
                    id: 'woc_f',
                    maxWidth: 50,
                    Cell: props => {
                        if (props.value !== undefined) {
                            return <OverlayTrigger placement="bottom" overlay={<Tooltip
                                id="tooltip">{props.value}</Tooltip>}>
                                <Label bsStyle="success">
                                    <i className="fa fa-envelope-o" aria-hidden="true"/>
                                </Label>
                            </OverlayTrigger>
                        }
                        return <Label bsStyle="danger"><i className="fa fa-times" aria-hidden="true"/></Label>
                    }
                }, {
                    Header: <i className="fa fa-thumbs-o-up" style={{color: 'blue'}} aria-hidden="true"/>,
                    accessor: 'reactions_num',
                    sort: 'dsc',
                    minWidth: 60,
                    maxWidth: 80
                }]
        };
        let time = {
            Header: 'Time',
            columns: [
                 {
                    Header: 'created',
                    id: 'createTime',
                    resizable: true,
                    minWidth: 150,
                    maxWidth: 200,
                    accessor: d => getTime(d.created_time),
                    Cell: props => <span>{formatDate(props.value)}</span>
                }, {
                    Header: 'updated',
                    id: 'lastUpdate',
                    show: !isMobile,
                    minWidth: 150,
                    maxWidth: 200,
                    accessor: d => getTime(d.updated_time),
                    Cell: props => <span>{formatDate(props.value)}</span>
                }]
        };
        const columns = [{
            Header: 'id',
            show: false,
            accessor: 'id',
        }, {
            Header:<small>{data.length}</small>,
            columns:[{
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
        }]}, post_info, time,
            {
                Header: 'Link',
                columns: [
                    {
                        Header: <i className="fa fa-external-link" style={{color: 'red'}} aria-hidden="true"/>, // Custom header components!
                        accessor: d => d.link,
                        minWidth: 200,
                        width: 300,
                        maxWidth: 400,
                        id: 'yt_link',
                        Cell: props => {
                            return props.value.url === undefined ? (<span>{props.value.title}</span>) : (
                                <a href={props.value.url} target="_newtab">{props.value.title}</a>)
                        }
                    }
                ]
            }

        ];
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
    error_days: PropTypes.array
};