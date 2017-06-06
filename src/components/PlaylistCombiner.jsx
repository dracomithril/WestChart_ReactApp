/**
 * Created by Gryzli on 05.06.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {ControlLabel, FormControl, FormGroup, Image, Radio} from "react-bootstrap";
export default class PlaylistCombiner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            chosen: undefined, indexer: [],
            isCurrentUser: true,
            userType:"this_user"
        }


    }

    componentWillUnmount() {
        console.log('component PlaylistCombiner unmounted');
    }

    componentDidMount() {
        console.log('component PlaylistCombiner did mount');
    }

    render() {
        const {sp_user} = this.context.store.getState();
        const {selected, chosen, indexer, isCurrentUser} = this.state;
        const map_selected = selected.map(elem => {
            return <div key={'sel_' + elem.id}>
                <span>{elem.name}</span>
            </div>
        });
        const item_list = (sp_user.playlists || []).map((elem) => {
            return <option key={elem.id}>{elem.name}</option>
        });
        return (<div>
            <h3>Combiner</h3>
            <div>

                <h5>From: </h5>
                <FormGroup onChange={(e) => {
                    this.setState({isCurrentUser:e.target.id==='this_user'?e.target.checked:false});
                    console.log(e.target.id);
                    console.log(e.target.checked);
                }}>
                    <Radio name="user" id="this_user">
                        <Image style={{width: 40, height: 40, padding: 5}} src={(sp_user.images[0] || {}).url}
                               rounded/>{sp_user.id}
                    </Radio>
                    <Radio name="user" id="dif_user">
                        <input type="text" disabled={isCurrentUser}/>
                        <button disabled={isCurrentUser}><i className="fa fa-search"/></button>
                    </Radio>
                </FormGroup>
                <FormGroup controlId="formControlsSelectMultiple">
                    <ControlLabel>Multiple select</ControlLabel>
                    <FormControl componentClass="select" multiple>
                        {item_list}
                    </FormControl>
                </FormGroup>
                <i className="fa fa-plus" aria-hidden="true" onClick={() => {
                    if (chosen && !indexer.contains(chosen.name)) {
                        this.setState({selected: [...selected, chosen]})
                    }
                }}/>
                {map_selected}
            </div>
            <div style={{border: '1px solid black', background: 'grey'}}>
                <h5>To:</h5>
                <span>Existing playlist</span>
                <select>
                    {item_list}
                </select>
                <span>New playlist</span>
                <input type="text"/>
            </div>
        </div>);
    }
}
PlaylistCombiner.contextTypes = {
    store: PropTypes.object
};
PlaylistCombiner.propTypes = {};