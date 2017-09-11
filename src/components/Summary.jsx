/**
 * Created by Gryzli on 09.04.2017.
 */
import React from "react";
import PropTypes from 'prop-types';
import {Badge} from "react-bootstrap";
import './components.css';

// let {sorting} = require('./../utils');
const create_print_list = (elem, index) => {
    return <div key={elem.id}>
        <span>{index + 1}</span>
        {`. ${elem.link.title} `}
        <Badge bsClass="likes">{elem.reactions_num + ' likes'}</Badge>
    </div>
};
export default class Summary extends React.Component {
    /*istanbul ignore next*/
    componentWillUnmount() {
        console.log('component Summary unmounted');
    }

    /*istanbul ignore next*/
    componentDidMount() {
        console.log('component Summary did mount');
    }

    render() {
         const {store} = this.context;
        const { sp_playlist_info} = store.getState();
        let print_list = this.props.selected.map(create_print_list);
        return (<div className="summary">
            <h3 id="summary">Summary</h3>
            {print_list.length > 0 && <h6>[WCS Weekly Westletter]</h6>}
            <div id="popover-contained" title="Print list">
                {print_list}
            </div>
            {sp_playlist_info.url&&<h6>{"Link to spotify playlist: "}
            <a href={sp_playlist_info.url} target="_newtab">{sp_playlist_info.url}</a>
            </h6>}
        </div>);
    }
}
Summary.contextTypes = {
    store: PropTypes.object
};
Summary.propTypes = {};