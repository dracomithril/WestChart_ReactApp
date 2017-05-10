/**
 * Created by Gryzli on 09.04.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Button, DropdownButton, MenuItem} from "react-bootstrap";
import PlaylistForm from "./PlaylistForm";
import Spotify from "spotify-web-api-node";
const spotifyApi = new Spotify();
const action_types = require('./../reducers/action_types');


export default class SpotifySearch extends React.Component {
    /*istanbul ignore next*/
    componentWillUnmount() {
        console.log('component SpotifySearch unmounted');
    }

    /*istanbul ignore next*/
    componentDidMount() {
        console.log('component SpotifySearch did mount');
    }
    create_search_list_view(search_elem, search_index) {
        const {store} = this.context;
        const items = search_elem.items.map((track, ind) => {
            const create_artist_list = (elem1, index) => {
                return <span style={{paddingRight: 5}} key={index}>{elem1.name}</span>
            };
            const artists = track.artists.map(create_artist_list);
            return <MenuItem value={track.name} key={ind} id={search_elem.id + '-' + ind} onClick={() => {
                console.log('track was selected ', track, ind);
                store.dispatch({
                    type: action_types.UPDATE_SINGLE_SEARCH,
                    field: 'selected',
                    value: track,
                    id: search_index
                })

            }}>
                <div>
                    <strong>{track.name}</strong><br/>
                    {/*<iframe src={search_elem.preview_url} frameBorder={0} allowTransparency="true"/>*/}
                    <span>by:</span>
                    <audio controls>
                        <source src={track.preview_url} type="audio/mpeg"/>
                        {'Your browser does not support the audio element.'}
                    </audio>
                    <div style={{paddingLeft: 10, color: "green"}}>
                        {artists}
                    </div>
                </div>
            </MenuItem>
        });
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
        return (<tr key={search_elem.id}>
            <td><input style={input_style} type="text" id={search_index} value={search_elem.artist || ''}
                       onChange={update_artist}/>
            </td>
            <td><input style={input_style} type="text" id={search_index} value={search_elem.title || ''}
                       onChange={update_title}/></td>

            <td>
                <Button id={'button-' + search_elem.id} onClick={() => {
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
                }}>search
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

    render() {
        const {store} = this.context;
        const {search_list} = store.getState();
        let search_list_view = search_list.map(this.create_search_list_view.bind(this));
        return (<div>
            <h3 id="list">{'Search music by: '}

                <div id="spotify_info"/>
                <PlaylistForm {...this.props}/>
            </h3>
            {search_list_view.length > 0 && <table>
                <thead>
                <tr>
                    <td>Artist:</td>
                    <td>Title:</td>
                    <td>options:</td>
                    <td>Selected:</td>
                </tr>
                </thead>
                <tbody>
                {search_list_view}
                </tbody>
            </table>}
        </div>);
    }
}
SpotifySearch.contextTypes = {
    store: PropTypes.object
};
SpotifySearch.propTypes = {
    selected: PropTypes.array
};