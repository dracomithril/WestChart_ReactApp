/**
 * Created by Gryzli on 29.03.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {OverlayTrigger, Popover, Tooltip} from "react-bootstrap";
export default class SongsPerDay extends React.Component {
    render() {
        const {store} = this.context;
        const {songs_per_day} = store.getState();
        const errorDays = this.props.error_days;
        let DayEntry = (props) => <div key={props.org}>
            <span style={{color: props.color}}>
            {new Date(props.org).toDateString()}
            </span>
        </div>;

        const err_days_less = errorDays.filter((elem) => elem.color === 'blue').map((elem) => DayEntry(elem));
        const err_days_more = errorDays.filter((elem) => elem.color === 'red').map((elem) => DayEntry(elem));


        let less_header = "less then expected";
        const popoverLess = (<Popover id="haveLessDays" title={less_header}>
            {err_days_less}
        </Popover>);
        const tooltipLess = <Tooltip id="haveLessDays">{less_header}</Tooltip>;
        let more_header = "more then expected";
        const popoverMore = (<Popover id="haveMoreDays" title={more_header}>
            {err_days_more}
        </Popover>);
        const tooltipMore = <Tooltip id="haveMoreDays">{more_header}</Tooltip>;
        return (<div id="songsPerDay" className={errorDays.length !== 0 ? "songsPerDay_err" : "songsPerDay_good"}>
            <span style={{paddingRight: 10}}>songs per day</span>
            <input type="number" value={songs_per_day} className="num_days"
                   name="songs_per_day" step={1} max={10} min={1}
                   onChange={(e) => store.dispatch({
                       type: 'UPDATE_SONGS_PER_DAY',
                       days: Number(e.target.value)
                   })}/>
                {/*{errorDays.length === 0 && <strong style={{color: "green"}}>No data</strong>}*/}
                {err_days_less.length > 0 && <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                                             overlay={err_days_less.length > 0 ? popoverLess : tooltipLess}>
                    <i id="less_days" className="fa fa-arrow-circle-down" aria-hidden="true">{err_days_less.length}</i>
                </OverlayTrigger>}
                {err_days_more.length > 0 && <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                                             overlay={err_days_more.length > 0 ? popoverMore : tooltipMore}>
                    <i id="more_days" className="fa fa-arrow-circle-up"
                       aria-hidden="true">{err_days_more.length}</i>
                </OverlayTrigger>}
        </div>);
    }
}
SongsPerDay.contextTypes = {
    store: PropTypes.object
};
SongsPerDay.propTypes = {
    error_days: PropTypes.array
};