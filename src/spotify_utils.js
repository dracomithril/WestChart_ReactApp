/**
 * Created by XKTR67 on 5/11/2017.
 */
import Spotify from "spotify-web-api-node";
const spotifyApi = new Spotify();
const action_types = require('./reducers/action_types');
const url = require('url');
const querystring = require('querystring');
const Cookies = require('cookies-js');
/**
 *
 * @param sp_user
 * @param sp_playlist_name
 * @param isPlaylistPrivate
 * @param selected
 * @param store
 */
export let createPlaylist = function (sp_user, sp_playlist_name, isPlaylistPrivate, selected, store) {
    spotifyApi.setAccessToken(sp_user.access_token);
    spotifyApi.createPlaylist(sp_user.id, sp_playlist_name, {'public': !isPlaylistPrivate})
        .then(function ({body}) {
            const spotify_url = body.external_urls.spotify;
            let playlist_name = body.name;
            console.log(`Created playlist! name: ${playlist_name} url: ${spotify_url}`);
            store.dispatch({type: action_types.UPDATE_PLAYLIST_INFO, value: {url: spotify_url, pl_name: playlist_name}});
            return spotifyApi.addTracksToPlaylist(sp_user.id, body.id, selected)
        })
        .then(function () {
            console.log('Added tracks to playlist!');
        })
        .catch(function (err) {
            console.log('Something went wrong!', err);
        });
};
/**
 * serach for matching music in spotify library
 * @param artist {string}
 * @param title {string}
 * @param search_id
 * @param store
 */
export const searchForMusic = function ({artist, title, search_id}, store) {
    spotifyApi.searchTracks(`${artist} ${title}`).then((data) => {
        store.dispatch({
            type: action_types.UPDATE_SINGLE_SEARCH,
            field: 'items',
            value: data.body.tracks.items,
            id: search_id
        });
    }).catch((e) => {
        console.error('error obtaining track', e.message)
    })
};

export const loginToSpotify = function () {
    return fetch('/api/login')
        .then((response) => {
            return response.text()
        }).then((path) => {
            const urlObj = url.parse(path);
            const query = querystring.parse(urlObj.query);
            Cookies.set('spotify_auth_state', query.state);
            console.log(path);
            window.location.assign(path);
            return Promise.resolve();
        }).catch((err) => {
            console.log(err);
        })
};
let validateCredentials = function (access_token, history, store) {
    spotifyApi.setAccessToken(access_token);
    spotifyApi.getMe().then(data => {
        console.log('you logged as :', data.body.id);
        Cookies.set('sp_user', JSON.stringify({access_token}), {expires: 3600});
        store.dispatch({type: 'UPDATE_SP_USER', user: data.body, access_token});
        history.push('')
    }).catch(e => {
        console.log(JSON.stringify(e));
    });
};

let exports = {
    createPlaylist, searchForMusic, loginToSpotify, validateCredentials
};
module.exports = exports;

export default exports;

