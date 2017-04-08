/**
 * Created by Gryzli on 06.04.2017.
 */
import React from "react";
import {Badge, Jumbotron, PageHeader} from "react-bootstrap";
import ChartTable from "./ChartTable";
let utils = require('./../utils');
let sorting = utils.sorting;
export default class ChartPresenter extends React.Component {

    render() {
        const {store} = this.context;
        const {list_sort} = store.getState();
        const sorting_options = Object.keys(sorting)
            .map((elem, index) => <option key={index} value={elem}>{elem.toLowerCase()}</option>);

        const viewChart = this.props.view_chart;
        let selected = viewChart.filter((elem) => elem.selected);
        sorting[list_sort](selected);
        const create_print_list = (elem, index) => {
            return <div key={elem.id}>
                <span>{index + 1}</span>
                {`. ${elem.link.title} `}
                <Badge bsClass="likes">{elem.reactions_num + ' likes'}</Badge>
            </div>
        };
        let print_list = selected.map(create_print_list);
        return ( <Jumbotron bsClass="App-body">
            <div>
                <ChartTable data={viewChart}/>
                <PageHeader id="list">{'List by: '}
                    <select name="list_sort" value={list_sort}
                            onChange={(e) => store.dispatch({type: 'UPDATE_LIST_SORT', sort: e.target.value})}>
                        {sorting_options}
                    </select>
                </PageHeader>
                <div id="popover-contained" title="Print list">
                    {print_list}
                </div>
            </div>
        </Jumbotron>);
    }
}
ChartPresenter.contextTypes = {
    store: React.PropTypes.object
};
ChartPresenter.propTypes = {};