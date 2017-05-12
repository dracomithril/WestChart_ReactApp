/**
 * Created by Gryzli on 10.04.2017.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Checkbox, Form, FormControl, FormGroup, Glyphicon, InputGroup} from "react-bootstrap";
import spotify_utils from "./../spotify_utils";
import utils from "../utils";
const action_types = require('./../reducers/action_types');


export default class PlaylistForm extends Component {
    /*istanbul ignore next*/
    componentWillUnmount() {
        console.log('component PlaylistForm unmounted');
    }

    /*istanbul ignore next*/
    componentDidMount() {
        console.log('component PlaylistForm did mount');
    }

    onStartClick() {
        const {store} = this.context;
        const {selected} = this.props;
        const date = new Date();
        const day1 = date.getDate();
        const str1 = date.toLocaleString('en-US', {month: 'short', day: 'numeric'}).toUpperCase();
        date.setDate(day1 - 4);
        const str2 = date.toLocaleString('en-US', {month: 'short', day: 'numeric'}).toUpperCase();
        let playlist_name = 'Chart_' + str2 + '-' + str1;
        let list = playlist_name.split(' ').join('_');
        store.dispatch({type: action_types.UPDATE_PLAYLIST_NAME, value: list});
        const search = selected.map((elem) => {
            const entry=utils.getArtist_Title(elem.link.title);
            return ({
                artist: entry.artist,
                title: entry.title,
                id: elem.id,
                items: [],
                selected: {}
            });
        });
        store.dispatch({type: action_types.UPDATE_SEARCH, search: search})
    }

    onCreatePlaylist() {
        const {store} = this.context;
        const {search_list, sp_user, sp_playlist_name, isPlaylistPrivate} = store.getState();
        // Create a private playlist
        let update_sp_info = function (spotify_url, sp_name) {
            store.dispatch({type: action_types.UPDATE_PLAYLIST_INFO, value: {url: spotify_url, pl_name: sp_name}});
        };
        const selected = search_list.map((elem) => elem.selected !== undefined ? elem.selected.uri : undefined).filter(elem => elem !== undefined);
        spotify_utils.create_sp_playlist(sp_user, sp_playlist_name, isPlaylistPrivate, selected, update_sp_info);
    }

    render() {
        const {store} = this.context;
        const {sp_playlist_name, isPlaylistPrivate} = store.getState();
        return ( <Form inline>
            <Button onClick={this.onStartClick.bind(this)} id="start_sp_button">Start
            </Button>
            <FormGroup style={{width: 300}} controlId="play_list_name" validationState={((sp_name_length) => {
                return sp_name_length > 8 ? 'success' : sp_name_length > 5 ? 'warning' : 'error';
            })(sp_playlist_name.length)}>
                <InputGroup>
                    <InputGroup.Addon><Glyphicon glyph="music"/></InputGroup.Addon>
                    <FormControl type="text" placeholder="playlist name" value={sp_playlist_name} onChange={(e) => {
                        store.dispatch({
                            type: action_types.UPDATE_PLAYLIST_NAME,
                            value: e.target.value,
                        })
                    }}/>
                    <FormControl.Feedback />
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <Button id="crt_pl_button" onClick={this.onCreatePlaylist.bind(this)}
                        disabled={sp_playlist_name.length < 6}>Create
                    Playlist
                </Button>
                <Checkbox style={{paddingLeft: 5}} id="play_list_is_private" onChange={(e) => {
                    store.dispatch({
                        type: action_types.TOGGLE_IS_PRIVATE,
                        value: e.target.checked
                    })
                }} value="private" checked={isPlaylistPrivate}>{'private ?'}</Checkbox>
            </FormGroup>
        </Form>);
    }
}
PlaylistForm.contextTypes = {
    store: PropTypes.object
};
PlaylistForm.propTypes = {
    selected: PropTypes.array
};