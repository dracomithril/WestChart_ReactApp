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
            header: props => <h3 id="chart_table">{'WCS Chart '}
                <small>{'total ' + count}</small>
            </h3>,
            columns: [
                {
                    sortable: false,
                    header: props => <Checkbox bsClass="checkbox1" onClick={() => {
                        store.dispatch({type: 'TOGGLE_ALL'})
                    }}/>,
                    minWidth: 30,
                    maxWidth: 60,
                    accessor: 'selected',
                    render: props => <Checkbox bsClass="checkbox1" checked={props.value} id={props.row.id}
                                               name="selected"
                                               onChange={(e) => {
                                                   store.dispatch({
                                                       type: 'TOGGLE_SELECTED', id: e.target.id,
                                                       checked: e.target.checked
                                                   })
                                               }}/>
                },
                {
                    header: 'user',
                    minWidth: 200,
                    maxWidth: 300,
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
                    header: 'reactions count',
                    accessor: 'reactions_num',
                    sort: 'dsc',
                    minWidth: 60,
                    maxWidth: 100
                }, {
                    header: 'crated time',
                    id: 'createTime',
                    minWidth: 150,
                    maxWidth: 200,
                    accessor: d => getTime(d.created_time),
                    render: props => <span>{formatDate(props.value)}</span>
                },
                {
                    header: 'added time',
                    id: 'addedTime',
                    maxWidth: 150,
                    accessor: d => d.added_time === undefined ? 0 : getTime(d.added_time),
                    render: props => {
                        return props.value === 0 ? <i className="fa fa-minus-circle" style={{color: 'red'}}/> :
                            <OverlayTrigger placement="top" overlay={<Tooltip
                                id="tooltip">{props.row.added_by}</Tooltip>}><span>{new Date(props.value).toLocaleString('pl-PL', {
                                year: "numeric",
                                month: "2-digit",
                                day: "numeric"
                            })}</span></OverlayTrigger>
                    }

                }, {
                    header: 'last update',
                    id: 'lastUpdate',
                    minWidth: 150,
                    maxWidth: 200,
                    accessor: d => getTime(d.updated_time),
                    render: props => <span>{formatDate(props.value)}</span>
                },
                {
                    header: props => <span>link</span>, // Custom header components!
                    accessor: d => d.link.title,
                    minWidth: 200,
                    width: 300,
                    maxWidth: 600,
                    id: 'yt_link',
                    render: props => props.row.link.url === undefined ? (<span>{props.value}</span>) : (
                        <a href={props.row.link.url}>{props.value}</a>)
                }
            ]
        }
        ];
        return (<ReactTable data={data} className="-striped -highlight" pageSizeOptions={[20, 50, 100]}
                            columns={columns} defaultPageSize={20} minRows={10}
                            noDataText={<span>{`Hi, ${user.first_name} please click `}<strong style={{color: "blue"}}>Update</strong>{` to start.`}</span>}/>);
    }
}
ChartTable.contextTypes = {
    store: PropTypes.object
};
ChartTable.propTypes = {};