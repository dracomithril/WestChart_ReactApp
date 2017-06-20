/**
 * Created by XKTR67 on 5/11/2017.
 */
const Spotify = require("spotify-web-api-node");
const spotifyApi = new Spotify();
const url = require('url');
const querystring = require('querystring');
const Cookies = require('cookies-js');
/**
 *
 * @param sp_user
 * @param sp_playlist_name
 * @param isPlaylistPrivate
 * @param tracks
 */
let createPlaylistAndAddTracks = function (sp_user, sp_playlist_name, isPlaylistPrivate, tracks) {
    spotifyApi.setAccessToken(sp_user.accessToken);
    let playlist_info;
    return spotifyApi.createPlaylist(sp_user.id, sp_playlist_name, {'public': !isPlaylistPrivate})
        .then(function ({body}) {
            if (body) {
                const spotify_url = body.external_urls.spotify;
                const playlist_name = body.name;
                console.log(`Created playlist! name: ${playlist_name} url: ${spotify_url}`);
                playlist_info = {url: spotify_url, pl_name: playlist_name};
                const playlist_id = body.id;
                return spotifyApi.addTracksToPlaylist(sp_user.id, playlist_id, tracks)
            }
            else {
                return Promise.reject(new Error('missing body'));
            }
        })
        .then(function (data) {
            console.log('Added tracks to playlist! ', data);
            return Promise.resolve(playlist_info)
        })
        .catch(function (err) {
            console.error('Something went wrong!', err);
            return Promise.reject(err);
        });
};


const getUserAndPlaylists = function (accessToken, user) {
    spotifyApi.setAccessToken(accessToken);
    let new_user;
    return spotifyApi.getUser(user)
        .then((data) => {
            const user_id = data.body.id;
            new_user = {
                pic: (data.body.images[0] || {}).url,
                id: user_id
            };
            // that.setState({users: updateUsers(user_id, new_user)});
            return spotifyApi.getUserPlaylists(user_id)

        }).then((playlist_data) => {
            new_user.items = playlist_data.body.items.filter(el=>{
                return el.owner.id===new_user.id;
            });
            console.log(`user: ${new_user.id} have ${new_user.items.length}(his own)/ total ${playlist_data.body.items.length}`);
            return Promise.resolve(new_user);
        }).catch(err => {
            console.log('Something went wrong!', err);
        });
};
const getTracks = function (accessToken, user, playlist_name) {
    spotifyApi.setAccessToken(accessToken);
    return spotifyApi.getPlaylist(user, playlist_name)
        .then(function (data) {
            let tracks= data.body.tracks.items.map(item=>item.track.id);
            console.log('Some information about this playlist', data.body);
            return Promise.resolve(tracks);
        });
};
/**
 * serach for matching music in spotify library
 * @param artist {string}
 * @param title {string}
 * @param search_id
 * @param store
 */
const searchForMusic = function ({artist, title, search_id}, store) {
    const {sp_user} = store.getState();
    spotifyApi.setAccessToken(sp_user.access_token);
    return spotifyApi.searchTracks(`${artist} ${title}`).then((data) => {
        return Promise.resolve({
            value: data.body.tracks.items,
            id: search_id
        });
    }).catch((e) => {
        console.error('error obtaining track', e.message)
    })
};

const loginToSpotify = function () {
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
/**
 *
 * @param access_token
 * @returns {Promise.<TResult>}
 */
let validateCredentials = function (access_token) {
    spotifyApi.setAccessToken(access_token);
    return spotifyApi.getMe().then(data => {
        console.log('you logged as :', data.body.id);
        return Promise.resolve({user: data.body, access_token});
    }).catch(e => {
        console.log(JSON.stringify(e));
    });
};

let exports = {
    createPlaylistAndAddTracks, searchForMusic, loginToSpotify, validateCredentials, getUserAndPlaylists, getTracks
};
module.exports = exports;

