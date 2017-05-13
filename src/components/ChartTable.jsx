/**
 * Created by Gryzli on 26.01.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import {Checkbox, Label, OverlayTrigger, Tooltip} from "react-bootstrap";

function formatDate(date) {
    return new Date(date).toLocaleString('pl-PL');
}
let getTime = function (date) {
    return new Date(date).getTime();
};
export default class ChartTable extends React.Component {
    render() {
        const {store} = this.context;
        const {user} = store.getState();
        const data = this.props.data;
        const count = data.length;
        const columns = [{
            Header: () => <h3 id="chart_table">{'WCS Chart '}
                <small>{'total ' + count}</small>
            </h3>,
            columns: [
                {
                    sortable: false,
                    resizable: false,
                    Header: () => <Checkbox bsClass="checkbox1" onClick={() => {
                        store.dispatch({type: 'TOGGLE_ALL'})
                    }}/>,
                    width: 40,
                    accessor: 'selected',
                    Cell: props =>{
                        return <Checkbox bsClass="checkbox1" checked={props.value} id={props.row.id}
                                               name="selected"
                                               onChange={(e) => {
                                                   store.dispatch({
                                                       type: 'TOGGLE_SELECTED', id: e.target.id,
                                                       checked: e.target.checked
                                                   })
                                               }}/>}
                },
                {
                    Header: 'user',
                    resizable: true,
                    minWidth: 200,
                    maxWidth: 300,
                    accessor: 'from_user', // String-based value accessors !
                    Cell: props => <span>{props.value}</span>
                }, {
                    Header: 'fb msg',
                    accessor: 'message',
                    maxWidth: 80,
                    Cell: props => {
                        if (props.value !== undefined) {
                            return <OverlayTrigger placement="bottom" overlay={<Tooltip
                                id="tooltip">{props.value}</Tooltip>}><Label
                                bsStyle="success">(...msg...)</Label></OverlayTrigger>
                        }
                        return <Label bsStyle="danger">no msg</Label>
                    }
                }, {
                    Header: 'reactions count',
                    accessor: 'reactions_num',
                    sort: 'dsc',
                    minWidth: 60,
                    maxWidth: 80
                }, {
                    Header: 'crated time',
                    id: 'createTime',

                    resizable: true,
                    minWidth: 150,
                    maxWidth: 200,
                    accessor: d => getTime(d.created_time),
                    Cell: props => <span>{formatDate(props.value)}</span>
                },
                {
                    Header: 'added time',
                    id: 'addedTime',
                    resizable: true,
                    maxWidth: 150,
                    accessor: d => d.added_time === undefined ? 0 : getTime(d.added_time),
                    Cell: props => {
                        return props.value === 0 ? <i className="fa fa-minus-circle" style={{color: 'red'}}/> :
                            <OverlayTrigger placement="top" overlay={<Tooltip
                                id="tooltip">{props.row._original.added_by}</Tooltip>}><span>{new Date(props.value).toLocaleString('pl-PL', {
                                year: "numeric",
                                month: "2-digit",
                                day: "numeric"
                            })}</span></OverlayTrigger>
                    }

                }, {
                    Header: 'last update',
                    id: 'lastUpdate',
                    minWidth: 150,
                    maxWidth: 200,
                    accessor: d => getTime(d.updated_time),
                    Cell: props => <span>{formatDate(props.value)}</span>
                },
                {
                    Header: props => <span>link</span>, // Custom header components!
                    accessor: d => d.link,
                    minWidth: 200,
                    width: 300,
                    maxWidth: 600,
                    id: 'yt_link',
                    Cell: props => {
                        return props.value.url === undefined ? (<span>{props.value.title}</span>) : (
                        <a href={props.value.url} target="_newtab">{props.value.title}</a>)}
                }
            ]
        }
        ];
        return (<ReactTable data={data} className="-striped -highlight" pageSizeOptions={[20, 50, 100]}
                            columns={columns} defaultPageSize={20} minRows={10} resizable={false}
                            noDataText={<span>{`Hi, ${user.first_name} please click `}<strong style={{color: "blue"}}>Update</strong>{` to start.`}</span>}/>);
    }
}
ChartTable.contextTypes = {
    store: PropTypes.object
};
ChartTable.propTypes = {};