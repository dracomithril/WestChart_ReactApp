/**
 * Created by Gryzli on 29.03.2017.
 */
import React from 'react';
import {Panel} from 'react-bootstrap';
export default class SongsPerDay extends React.Component {
    render() {
        let err_days = this.props.error_days.map((elem) => {
            return <div key={elem.org}><span style={{color: elem.color}}>{new Date(elem.org).toDateString()}</span>
            </div>;
        });
        return (<Panel
            header={<div><strong style={{paddingRight: 20}}>{'songs per day'}
            </strong><input type="number" value={this.props.songs_per_day} className="num_days"
                            name="songs_per_day" step={1} max={10} min={2} onChange={this.props.onChange}/>
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
SongsPerDay.propTypes = {};