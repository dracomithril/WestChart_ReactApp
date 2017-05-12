/**
 * Created by XKTR67 on 5/11/2017.
 */
import Spotify from "spotify-web-api-node";
const spotifyApi = new Spotify();

export let create_sp_playlist = function (sp_user, sp_playlist_name, isPlaylistPrivate, selected, update_spotify_info) {
    spotifyApi.setAccessToken(sp_user.access_token);
    spotifyApi.createPlaylist(sp_user.id, sp_playlist_name, {'public': !isPlaylistPrivate})
        .then(function ({body}) {
            const spotify_url = body.external_urls.spotify;
            console.log(spotify_url);
            console.log('Created playlist! name: ', body.name);
            update_spotify_info(spotify_url, body.name);
            return spotifyApi.addTracksToPlaylist(sp_user.id, body.id, selected)
        })
        .then(function () {
            console.log('Added tracks to playlist!');
        })
        .catch(function (err) {
            console.log('Something went wrong!', err);
        });
};

let exports = {
    create_sp_playlist
};
module.exports = exports;

export default exports;

