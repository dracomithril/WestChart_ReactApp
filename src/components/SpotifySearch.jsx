/**
 * Created by Gryzli on 09.04.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import PlaylistForm from "./PlaylistForm";
import RowSpotifySearch from "./RowSpotifySearch"

export default class SpotifySearch extends React.Component {
    /*istanbul ignore next*/
    componentWillUnmount() {
        console.log('component SpotifySearch unmounted');
    }

    /*istanbul ignore next*/
    componentDidMount() {
        console.log('component SpotifySearch did mount');
    }

    render() {
        const {store} = this.context;
        const {search_list, sp_playlist_info} = store.getState();
        let search_list_view = search_list.map((search_elem, search_index)=> {
            return <RowSpotifySearch search_elem={search_elem} search_index={search_index} key={search_elem.id}/>
        });
        return (<div>
            <h3 id="list">{'Search music by: '}
                {sp_playlist_info.url !== null && <div className="spotify_sumary">
                    <span>{'Created playlist! name: ' + sp_playlist_info.pl_name}</span><br/>
                    <a href={sp_playlist_info.url} target="_newtab">{sp_playlist_info.pl_name}</a>
                </div>}
                <PlaylistForm {...this.props}/>
            </h3>
            {search_list_view.length > 0 && <table>
                <thead>
                <tr>
                    <td>Artist:</td>
                    <td id="flip"/>
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