/**
 * Created by Gryzli on 10.04.2017.
 */
import React from "react";
import {Button, Checkbox, Form, FormControl, FormGroup, Glyphicon, InputGroup} from "react-bootstrap";
import ReactDOM from "react-dom";
import Spotify from "spotify-web-api-node";
const spotifyApi = new Spotify();
const action_types = require('./../reducers/action_types');
export default class PlaylistForm extends React.Component {
    componentWillUnmount() {
        console.log('component PlaylistForm unmounted');
    }

    componentDidMount() {
        console.log('component PlaylistForm did mount');
    }

    onStartClick() {
        const {store} = this.context;
        const {selected} = this.props;
        const date = new Date();
        const day1 = date.getDate();
        const str1 = date.toLocaleString('en-US', {month: 'short', day: 'numeric'});
        date.setDate(day1 - 5);
        const str2 = date.toLocaleString('en-US', {month: 'short', day: 'numeric'});
        let playlist_name = 'Chart ' + str2 + '-' + str1;
        let list = playlist_name.split(' ').join('_');
        store.dispatch({type: action_types.UPDATE_PLAYLIST_NAME, value: list});
        const search = selected.map((elem) => {
            let entry = elem.link.title.split('-');
            return ({
                artist: entry[0],
                title: entry[1],
                id: elem.id,
                items: [],
                selected: {}
            });
        });
        store.dispatch({type: action_types.UPDATE_SEARCH, search: search})
    }

    onCreatePlaylist() {
        const {store} = this.context;
        const {search_list, sp_user, sp_playlist_name} = store.getState();
        const isPrivate = document.getElementById("play_list_is_private").checked;
        // Create a private playlist
        const selected = search_list.map((elem) => elem.selected !== undefined ? elem.selected.uri : undefined).filter(elem => elem !== undefined);
        console.log(selected.length);
        spotifyApi.setAccessToken(sp_user.access_token);
        spotifyApi.createPlaylist(sp_user.id, sp_playlist_name, {'public': !isPrivate})
            .then(function ({body}) {
                const spotify_url = body.external_urls.spotify;
                console.log(spotify_url);
                console.log('Created playlist! name: ', body.name);
                let entry =
                    (<div className="spotify_sumary">
                        <span>{'Created playlist! name: ' + body.name}</span><br/>
                        <a href={spotify_url}>{spotify_url}</a>
                    </div>);
                ReactDOM.render(
                    entry,
                    document.getElementById("spotify_info")
                );
                return spotifyApi.addTracksToPlaylist(sp_user.id, body.id, selected)
            })
            .then(function (data) {
                console.log('Added tracks to playlist!');
            })
            .catch(function (err) {
                console.log('Something went wrong!', err);
            });
    }

    render() {
        const {store} = this.context;
        const {sp_playlist_name} = store.getState();
        return ( <Form inline>
            <Button onClick={this.onStartClick.bind(this)}>Start
            </Button>
            <FormGroup style={{width: 300}} controlId="play_list_name" validationState={(() => {
                const length = sp_playlist_name.length;
                if (length > 8) return 'success';
                else if (length > 5) return 'warning';
                else if (length >= 0) return 'error';
            })()}>
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
                <Button onClick={this.onCreatePlaylist.bind(this)} disabled={sp_playlist_name.length < 6}>Create
                    Playlist
                </Button>
                <Checkbox style={{paddingLeft: 5}} id="play_list_is_private" value="private">{'private ?'}</Checkbox>
            </FormGroup>
        </Form>);
    }
}
PlaylistForm.contextTypes = {
    store: React.PropTypes.object
};
PlaylistForm.propTypes = {};