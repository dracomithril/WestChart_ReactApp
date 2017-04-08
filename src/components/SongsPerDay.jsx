/**
 * Created by Gryzli on 29.03.2017.
 */
import React from "react";
import {Panel} from "react-bootstrap";
export default class SongsPerDay extends React.Component {
    render() {
        const {store} = this.context;
        const {songs_per_day} = store.getState();
        const errorDays = this.props.error_days;
        let err_days = errorDays.map((elem) => {
            return <div key={elem.org}><span style={{color: elem.color}}>{new Date(elem.org).toDateString()}</span>
            </div>;
        });
        return (<Panel
            header={<div><strong style={{paddingRight: 20}}>{'songs per day'}
            </strong><input type="number" value={songs_per_day} className="num_days"
                            name="songs_per_day" step={1} max={10} min={1}
                            onChange={(e) => store.dispatch({
                                type: 'UPDATE_SONGS_PER_DAY',
                                days: Number(e.target.value)
                            })}/>
            </div>}
            bsStyle={err_days.length !== 0 ? "danger" : "success"}
            footer={err_days.length !== 0 && ("miss mach count: " + err_days.length)}>

            {err_days.length !== 0 &&
            <div><strong>Date:</strong>(<span style={{color: 'blue', marginRight: 5}}>not enough</span><span
                style={{color: 'red'}}>to many</span>)<br/>
                {err_days}
            </div>}
        </Panel>);
    }
}
SongsPerDay.contextTypes = {
    store: React.PropTypes.object
};
SongsPerDay.propTypes = {};