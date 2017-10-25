/**
 * Created by Gryzli on 21.10.2017.
 */
import React from 'react';
import PropTypes from "prop-types";
import {Image, Tooltip, OverlayTrigger} from "react-bootstrap";
import utils from "../utils";

export default class NewsLetter extends React.Component {
    componentWillUnmount() {
        console.log('component NewsLetter unmounted');
    }

    componentDidMount() {
        console.log('component NewsLetter did mount');
    }

    render() {
        const newsLetter = this.props.data;
        const today = new Date();
        const today_week= utils.weekInfo(today);
        const show = newsLetter.map((elem) => {
            let create_date = new Date(elem.created_time);
            const {weekNumber}= utils.weekInfo(create_date);
            return (<div style={{padding: 2, display: "block", border: "1px black solid"}} key={elem.id}>
                <input type={"checkbox"}/>
                <span hidden>{elem.id}</span>
                <OverlayTrigger placement={"bottom"} overlay={<Tooltip id={"tt_" + elem.id}>{elem.from_user}</Tooltip>}>
                    <Image src={utils.getFbPictureUrl(elem.from.id)}/>
                </OverlayTrigger>

                <div>
                    <span>{create_date.toLocaleDateString()}</span><br/>
                    <span>week:{weekNumber}</span><br/>
                    <span>is added</span>
                </div>
            </div>)
        });
        return (<div>
            <h4>We have {today_week.weekNumber} week of {today.getFullYear()}</h4>
            <div style={{display:"inline-flex"}}>
            {show}
            </div>
        </div>);
    }
}
NewsLetter.propTypes = {
    data: PropTypes.array
};
NewsLetter.contextTypes = {
    store: PropTypes.object
};