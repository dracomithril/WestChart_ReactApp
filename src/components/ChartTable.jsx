/**
 * Created by Gryzli on 26.01.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import {OverlayTrigger, Checkbox, Label, Tooltip, Button, Popover, ButtonGroup} from 'react-bootstrap';
import SongsPerDay from "./SongsPerDay";
import FilteringOptions from "./FilteringOptions";
import PickYourDate from './PickYourDate';
let utils = require('./../utils');
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
        const {store} = this.context;
        const {user, since, until, last_update} = store.getState();
        const {data, error_days} = this.props;
        const count = data.length;
        const options = {weekday: 'short', month: '2-digit', day: 'numeric'};
        let header = () => <div>
            <SongsPerDay error_days={error_days}/>
            <PickYourDate/>
            <small style={{float: "right"}}>{count}</small>
            <div style={{textAlign: "center"}}>
                <ButtonGroup bsSize="large">
                    <OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={<Popover id="update_info">
                        <span>{"since: "}</span>
                        <Label
                            bsStyle="success">{since !== '' ? new Date(since).toLocaleDateString('pl-PL', options) : 'null'}</Label>
                        <span>{" to "}</span>
                        <Label
                            bsStyle="danger">{until !== '' ? new Date(until).toLocaleDateString('pl-PL', options) : 'null'}</Label><br/>
                        <small
                            id="updateDate">{' Last update: ' + new Date(last_update).toLocaleString('pl-PL')}</small>
                    </Popover>}>
                        <Button id="updateChartB" onClick={() => utils.UpdateChart(store)}
                                bsStyle="primary">Update</Button>
                    </OverlayTrigger>
                    <FilteringOptions/>
                </ButtonGroup>
            </div>

        </div>;
        const columns = [{
            Header: header,
            columns: [{
                show: false,
                accessor: 'id',
            },
                {
                    sortable: false,
                    resizable: false,
                    Header: () => <Checkbox bsClass="checkbox1" onClick={() => {
                        store.dispatch({type: 'TOGGLE_ALL'})
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
                },
                {
                    Header: <i className="fa fa-user-circle" aria-hidden="true">user</i>,
                    resizable: true,
                    minWidth: 200,
                    maxWidth: 300,
                    id: 'user',
                    accessor: 'from_user', // String-based value accessors !
                    Cell: props => <span>{props.value}</span>
                }, {
                    Header: <i className="fa fa-envelope-o" aria-hidden="true"/>,
                    accessor: 'message',
                    id: 'woc_f',
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
                    Header: <i className="fa fa-thumbs-o-up" aria-hidden="true"/>,
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
                    Header: <i className="fa fa-external-link" aria-hidden="true"/>, // Custom header components!
                    accessor: d => d.link,
                    minWidth: 200,
                    width: 300,
                    maxWidth: 600,
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
                            columns={columns} defaultPageSize={20} minRows={10}
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