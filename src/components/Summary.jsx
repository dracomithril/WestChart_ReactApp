/**
 * Created by Gryzli on 09.04.2017.
 */
import React from "react";
import PropTypes from 'prop-types';
import {Badge} from "react-bootstrap";
let {sorting} = require('./../utils');
const create_print_list = (elem, index) => {
    return <div key={elem.id}>
        <span>{index + 1}</span>
        {`. ${elem.link.title} `}
        <Badge bsClass="likes">{elem.reactions_num + ' likes'}</Badge>
    </div>
};
export default class Summary extends React.Component {
    componentWillUnmount() {
        console.log('component Summary unmounted');
    }

    componentDidMount() {
        console.log('component Summary did mount');
    }

    render() {
        const {store} = this.context;
        const {list_sort} = store.getState();
        const sorting_options = Object.keys(sorting)
            .map((elem, index) => <option key={index} value={elem}>{elem.toLowerCase()}</option>);
        let print_list = this.props.selected.map(create_print_list);
        return (<div>
            <h3 id="list">{'List by: '}
                <select name="list_sort" value={list_sort}
                        onChange={(e) => store.dispatch({
                            type: 'UPDATE_LIST_SORT',
                            sort: e.target.value
                        })}>
                    {sorting_options}
                </select>
            </h3>
            <div id="popover-contained" title="Print list">
                {print_list}
            </div>
        </div>);
    }
}
Summary.contextTypes = {
    store: PropTypes.object
};
Summary.propTypes = {};