/**
 * Created by Gryzli on 26.01.2017.
 */
import React from 'react';
import ReactTable from 'react-table';
import {Label, OverlayTrigger, Tooltip} from 'react-bootstrap';
const columns = [{
    header: 'WCS Chart',
    columns: [
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
            header: 'likes Count',
            accessor: 'likes_num',
            sort: 'dsc',
            minWidth: 60,
            maxWidth: 120
        }, {
            header: 'crated time',
            id: 'createTime',
            maxWidth: 200,
            accessor: d => {
                return d.created_time.getTime()
            },
            render: props => <span>{formatDate(props.value)}</span>
        }, {
            header: 'last update',
            id: 'lastUpdate',
            maxWidth: 200,
            accessor: d => {
                return d.updated_time.getTime()
            },
            render: props => <span>{formatDate(props.value)}</span>
        }, {
            header: props => <span>link</span>, // Custom header components!
            accessor: d => d.link.name,
            id: 'yt_link',
            render: props => {
                return (<a href={props.row.link.url}>{props.value}</a>)
            }
        }
    ]
}
];
function formatDate(date) {
    return new Date(date).toLocaleString('pl-PL');
}
export default class ChartTable extends React.Component {
    render() {

        return (<ReactTable data={this.props.data} className="-striped -highlight" pageSizeOptions={[20, 50, 100]}
                            columns={columns} defaultPageSize={20} minRows={10}/>);
    }
}
ChartTable.propTypes = {};