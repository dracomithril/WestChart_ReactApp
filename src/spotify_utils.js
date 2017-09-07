/**
 * Created by XKTR67 on 5/11/2017.
 */
const Spotify = require("spotify-web-api-node");
const spotifyApi = new Spotify();
const url = require('url');
const querystring = require('querystring');
const Cookies = require('cookies-js');
const _ = require('lodash');


const addTrucksToPlaylist = function (user_id, playlist_id, tracks) {
    if (tracks.length === 0) {
        return Promise.reject(new Error("nothing was updated. Tracks count is 0"))
    } else if (tracks.length > 100) {
        /**
         *
         * @param array {Array}
         * @param count {number}
         * @returns {Array}
         */
        let sliceCount = function (array, count) {
            if (array.length > count) {
                let t1 = _.take(array, count);
                let d1 = _.drop(array, count);
                if (d1.length > 100) {
                    let sliceCount2 = sliceCount(d1, count);
                    return [t1, ...sliceCount2]
                }
                return [t1, d1];
            }
            else {
                return tracks;
            }
        };

        let tz = sliceCount(tracks, 100);
        let actions = tz.map(el => spotifyApi.addTracksToPlaylist(user_id, playlist_id, el));
        return Promise.all(actions).then((/*d5*/) => {
            // console.log(d5.length);
            console.log('all adding done?')
        }).catch(e => {
            console.error(e);
        })
    }

    return spotifyApi.addTracksToPlaylist(user_id, playlist_id, tracks)
};

const addTrucksToPlaylistNoRepeats = function (user_id, playlist_id, tracks) {
    return spotifyApi.getPlaylist(user_id, playlist_id, {limit: 100}).then(data => {
        const body = data.body;
//todo is there more  tracks in playlist?
        let pl_tracks = body.tracks.items.map(item => item.track.uri);
        let dif_tracks = _.difference(tracks, pl_tracks);
        const spotify_url = body.external_urls.spotify;
        const playlist_name = body.name;
        console.log(`Created playlist! name: ${playlist_name} url: ${spotify_url}`);
        const playlist_info = {url: spotify_url, pl_name: playlist_name};
        const playlist_id = body.id;
        return addTrucksToPlaylist(user_id, playlist_id, dif_tracks).then((data) => {
            console.log('Added tracks to playlist! ', data);
            return Promise.resolve(playlist_info)
        })
    })
};
/**
 *
 * @param sp_user
 * @param sp_playlist_name
 * @param isPlaylistPrivate
 * @param tracks
 */
let createPlaylistAndAddTracks = function (sp_user, sp_playlist_name, isPlaylistPrivate, tracks) {
    spotifyApi.setAccessToken(sp_user.access_token);
    return spotifyApi.createPlaylist(sp_user.id, sp_playlist_name, {'public': !isPlaylistPrivate})
        .then(({body}) => {
            if (body) {
                const spotify_url = body.external_urls.spotify;
                const playlist_name = body.name;
                console.log(`Created playlist! name: ${playlist_name} url: ${spotify_url}`);
                const playlist_info = {url: spotify_url, pl_name: playlist_name};
                const playlist_id = body.id;
                //todo there is some problem if there is more then 100 tracks
                return addTrucksToPlaylist(sp_user.id, playlist_id, tracks).then((data) => {
                    console.log('Added tracks to playlist! ', data);
                    return Promise.resolve(playlist_info)
                })
            }
            else {
                return Promise.reject(new Error('missing body'));
            }
        })
        .catch((err) => {
            console.error('Something went wrong!', err);
            return Promise.reject(err);
        });
};

const getUserAndPlaylists = function (accessToken, user) {
    spotifyApi.setAccessToken(accessToken);
    let new_user;
    return spotifyApi.getUser(user)
        .then((data) => {
            const user_id = (data.body || {}).id;
            new_user = {
                pic: (data.body.images[0] || {}).url,
                id: user_id
            };
            // that.setState({users: updateUsers(user_id, new_user)});
            return spotifyApi.getUserPlaylists(user_id, {limit: 50})

        }).then((playlist_data) => {
            new_user.items = playlist_data.body.items.filter(el => {
                return el.owner.id === new_user.id;
            });
            new_user.total = playlist_data.body.total;
            console.log(`user: ${new_user.id} have ${new_user.items.length}(his own)/ total ${playlist_data.body.items.length}`);
            return Promise.resolve(new_user);
        }).catch(err => {
            let error = err.message === 'Not Found' ? new Error('No user named ' + user) : err;
            console.log('Something went wrong!', err);
            return Promise.reject(error);
        });
};
const getTracks = function (accessToken, user, playlist_name) {
    spotifyApi.setAccessToken(accessToken);
    return spotifyApi.getPlaylist(user, playlist_name)
        .then(function (data) {
            let tracks = data.body.tracks.items.map(item => item.track.uri);
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

function setATInterval() {
    return new Promise((resolve, reject) => {
        let counter = 0;
        let int = setInterval(() => {
            const ac = Cookies.get('wcs_sp_user_ac');
            if (ac) {
                clearInterval(int);
                resolve(ac);
            }
            console.log("counter: " + counter);
            if (counter === 10) {
                clearInterval(int);
                reject(new Error('to many retries on getting access_token'))
            }
            counter++;
        }, 1000);
    });
}

const loginToSpotify = function () {
    return fetch('/api/spotify/login_f', {credentials: 'include'})
        .then((response) => {
            return response.text()
        }).then((path) => {
            const signinWin = window.open(path, '_blank', "width=780,height=410,toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0");

            if (signinWin === null) {
                alert("Sorry. To login you need to enable popups for this page or click on Login to Spotify button. Have a nice day ;) ")
            } else {
                signinWin.focus();
                return setATInterval()
            }
            return Promise.reject(new Error('Popup Blocked'))
        })
};
const refresh_auth = function (refresh_token) {
    return fetch('/api/refresh_token?' + querystring.stringify({refresh_token: refresh_token}), {method: 'GET'})
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
 */
let validateCredentials = function (access_token) {
    spotifyApi.setAccessToken(access_token);
    return spotifyApi.getMe().then(data => {
        console.log('you logged as :', data.body.id);
        return Promise.resolve({user: data.body, access_token});
    });
};

let exports = {
    createPlaylistAndAddTracks, searchForMusic, loginToSpotify, refresh_auth, addTrucksToPlaylistNoRepeats,
    validateCredentials, getUserAndPlaylists, getTracks, setATInterval
};
module.exports = exports;

