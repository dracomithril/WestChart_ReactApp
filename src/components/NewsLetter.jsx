/**
 * Created by Gryzli on 21.10.2017.
 */
import React from 'react';
import PropTypes from "prop-types";
import {Image} from "react-bootstrap";

export default class NewsLetter extends React.Component {
    componentWillUnmount() {
        console.log('component NewsLetter unmounted');
    }

    componentDidMount() {
        console.log('component NewsLetter did mount');
    }

    render() {
        const newsLetter = this.props.data;
        const show = newsLetter.map((elem, ind) => {
            return (<li style={{padding:2}}>
                <input type={"checkbox"}/>
                <span>{elem.id}</span>
                <Image src={`https://graph.facebook.com/v2.9/${elem.from.id}/picture`}/>
                <span>{elem.from_user}</span>
                <span>{new Date(elem.created_time).toLocaleDateString()}</span>
                <span>week?</span>
                <span>is added</span>
            </li>)
        });
        return (<div>
            <ol>
                {show}
            </ol>
        </div>);
    }
}
NewsLetter.propTypes = {
    data: PropTypes.object
};
NewsLetter.contextTypes = {
    store: PropTypes.object
};