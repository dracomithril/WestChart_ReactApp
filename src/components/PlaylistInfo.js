/**
 * Created by xktr67 on 6/21/2017.
 */
import React from "react";
import PropTypes from "prop-types";

const PlaylistInfo = (props) => {
    let spPlaylistInfo = props.info;
    return (<div>
        {spPlaylistInfo.url !== null && <div className="spotify_sumary">
            <span>{'Created '}<i className="fa fa-spotify"
                                 aria-hidden="true">Spotify</i>{' playlist! name: '}</span><a href={spPlaylistInfo.url} target="_newtab">{spPlaylistInfo.pl_name}</a><br/>
            <a href={spPlaylistInfo.url} target="_newtab">{spPlaylistInfo.url}</a>
        </div>}
    </div>)
};
PlaylistInfo.propTypes = {
    info: PropTypes.object
};

export default PlaylistInfo;