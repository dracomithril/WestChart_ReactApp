/**
 * Created by XKTR67 on 5/11/2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Button, DropdownButton, MenuItem} from "react-bootstrap";
import Spotify from "spotify-web-api-node";
const spotifyApi = new Spotify();
const action_types = require('./../reducers/action_types');


export default class RowSpotifySearch extends React.Component {
    render() {
        const {store} = this.context;
        const search_index = this.props.search_index;
        const search_elem = this.props.search_elem;
        const create_menuItems = (track, ind) => {
            const artists = track.artists.map((elem) => elem.name).join(' & ');
            let selectTrack = () => {
                console.log('track was selected ', track, ind);
                store.dispatch({
                    type: action_types.UPDATE_SINGLE_SEARCH,
                    field: 'selected',
                    value: track,
                    id: search_index
                })
            };
            return (<MenuItem value={track.name} key={ind} id={search_elem.id + '-' + ind} onClick={selectTrack}>
                <div>
                    <strong>{track.name}</strong><br/>
                    <span>by:</span>
                    <audio controls>
                        <source src={track.preview_url} type="audio/mpeg"/>
                        {'Your browser does not support the audio element.'}
                    </audio>
                    <div style={{paddingLeft: 10, color: "green"}}>
                        <span style={{paddingRight: 5}}>{artists}</span>
                    </div>
                </div>
            </MenuItem>)
        };
        const items = search_elem.items.map(create_menuItems);
        const condition = search_elem.selected !== undefined && search_elem.selected.preview_url !== undefined;
        const update_artist = (e) => {
            store.dispatch({
                type: action_types.UPDATE_SINGLE_SEARCH,
                field: 'artist',
                value: e.target.value,
                id: e.target.id
            })
        };
        const update_title = (e) => {
            store.dispatch({
                type: action_types.UPDATE_SINGLE_SEARCH,
                field: 'title',
                value: e.target.value,
                id: e.target.id
            })
        };
        let input_style = {paddingRight: 5};
        let searchSpotifyTracks = () => {
            spotifyApi.searchTracks(`${search_elem.artist} ${search_elem.title}`).then((data) => {
                store.dispatch({
                    type: action_types.UPDATE_SINGLE_SEARCH,
                    field: 'items',
                    value: data.body.tracks.items,
                    id: search_index
                });
            }).catch((e) => {
                console.error('error obtaining track', e.message)
            })
        };
        return (<tr>
            <td><input style={input_style} type="text" id={search_index} value={search_elem.artist || ''}
                       onChange={update_artist}/>
            </td>
            <td>
                <button onClick={()=>{
                    store.dispatch({
                        type: action_types.SWAP_FIELDS,
                        id: search_index
                    });
                }}><i className="fa fa-refresh" aria-hidden="true"/></button>
            </td>
            <td><input style={input_style} type="text" id={search_index} value={search_elem.title || ''}
                       onChange={update_title}/>
            </td>
            <td>
                <Button id={'button-' + search_elem.id} onClick={searchSpotifyTracks}>search
                </Button>
            </td>
            <td>
                {items.length > 0 &&
                <DropdownButton title={'select'} key={search_index} id={`dropdown-basic-${search_index}`}>
                    {items}
                </DropdownButton>}
            </td>
            <td>
                {condition &&
                <audio controls>
                    <source src={search_elem.selected.preview_url} type="audio/mpeg"/>
                    {'Your browser does not support the audio element.'}
                </audio>}
            </td>
        </tr>);
    }
}
RowSpotifySearch.contextTypes = {
    store: PropTypes.object
};
RowSpotifySearch.propTypes = {
    search_index: PropTypes.number,
    search_elem: PropTypes.object
};