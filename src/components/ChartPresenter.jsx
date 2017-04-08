/**
 * Created by Gryzli on 06.04.2017.
 */
import React from "react";
import ReactDOM from "react-dom";
import {Badge, DropdownButton, Jumbotron, MenuItem, PageHeader} from "react-bootstrap";
import Spotify from "spotify-web-api-node";
import ChartTable from "./ChartTable";
const spotifyApi = new Spotify();
let utils = require('./../utils');
let sorting = utils.sorting;

export default class ChartPresenter extends React.Component {
    componentWillUnmount() {
        console.log('component ChartPresenter unmounted');
    }

    componentDidMount() {
        console.log('component ChartPresenter did mount');
    }

    render() {
        const {store} = this.context;
        const {list_sort, search_list, sp_user} = store.getState();
        const sorting_options = Object.keys(sorting)
            .map((elem, index) => <option key={index} value={elem}>{elem.toLowerCase()}</option>);

        const viewChart = this.props.view_chart;
        let selected = viewChart.filter((elem) => elem.selected);
        sorting[list_sort](selected);
        const create_print_list = (elem, index) => {
            return <div key={elem.id}>
                <span>{index + 1}</span>
                {`. ${elem.link.title} `}
                <Badge bsClass="likes">{elem.reactions_num + ' likes'}</Badge>
            </div>
        };
        let print_list = selected.map(create_print_list);
        let search_list_view = search_list.map((search_elem, search_index) => {
            const items = search_elem.items.map((track, ind) => {
                const artists = track.artists.map((elem1, index) => {
                    return <div key={index}>
                        <span >{elem1.name}</span>
                    </div>
                });
                return <MenuItem value={track.name} key={ind} id={search_elem.id + '-' + ind} onClick={(event, zzz) => {
                    console.log('track was selected ', track, ind);
                    store.dispatch({
                        type: 'UPDATE_SINGLE_SEARCH',
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
            return (<tr key={search_elem.id}>
                <td><input type="text" id={search_index} value={search_elem.artist || ''} onChange={(e) => {
                    store.dispatch({
                        type: 'UPDATE_SINGLE_SEARCH',
                        field: 'artist',
                        value: e.target.value,
                        id: e.target.id
                    })
                }}/></td>
                <td><input type="text" id={search_index} value={search_elem.title || ''} onChange={(e) => {
                    store.dispatch({
                        type: 'UPDATE_SINGLE_SEARCH',
                        field: 'title',
                        value: e.target.value,
                        id: e.target.id
                    })
                }}/></td>
                <td>
                    <DropdownButton title={'select'} key={search_index} id={`dropdown-basic-${search_index}`}>
                        {items}
                    </DropdownButton>
                </td>
                <td>
                    <button id={'button-' + search_elem.id} onClick={() => {
                        //spotifyApi.setAccessToken(sp_user.access_token);

                        spotifyApi.searchTracks(`${search_elem.artist} ${search_elem.title}`).then((data) => {
                            store.dispatch({
                                type: 'UPDATE_SINGLE_SEARCH',
                                field: 'items',
                                value: data.body.tracks.items,
                                id: search_index
                            });
                            //console.log(JSON.stringify(data));
                        }).catch((e) => {
                            console.error('error obtaining track', e.message)
                        })


                    }}>search
                    </button>
                </td>
                <td>
                    {(condition) && <audio controls>
                        <source src={search_elem.selected.preview_url} type="audio/mpeg"/>
                        {'Your browser does not support the audio element.'}
                    </audio>}
                </td>
            </tr>);
        });
        return ( <Jumbotron bsClass="App-body">
            <div>
                <ChartTable data={viewChart}/>
                <PageHeader id="list">{'List by: '}
                    <select name="list_sort" value={list_sort}
                            onChange={(e) => store.dispatch({type: 'UPDATE_LIST_SORT', sort: e.target.value})}>
                        {sorting_options}
                    </select>
                </PageHeader>
                <div id="popover-contained" title="Print list">
                    {print_list}
                </div>
                <PageHeader id="list">{'Search music by: '}
                </PageHeader>
                <div id="spotify_info" />
                <button onClick={() => {
                    const search = selected.map((elem, index) => {
                        let entry = elem.link.title.split('-');
                        return ({
                            artist: entry[0],
                            title: entry[1],
                            id: elem.id,
                            items: [],
                            selected: {}
                        });
                    });
                    store.dispatch({type: 'UPDATE_SEARCH', search: search})
                }}>Start
                </button>
                <span>Name:</span><input type="text" id="play_list_name"/>
                <label><input type="checkbox" id="play_list_is_private" value="private"/>{' is private '}</label>
                <button onClick={() => {
                    const playlist_name = document.getElementById("play_list_name").value;
                    const isPrivate = document.getElementById("play_list_is_private").checked;
                    // Create a private playlist
                    const selected = search_list.map((elem) => elem.selected !== undefined ? elem.selected.uri : undefined).filter(elem => elem !== undefined);
                    console.log(selected.length);

                    spotifyApi.setAccessToken(sp_user.access_token);
                    spotifyApi.createPlaylist(sp_user.id, playlist_name, {'public': !isPrivate})
                        .then(function ({body}) {
                            console.log(body.external_urls.spotify);
                            console.log('Created playlist! name: ',body.name);
                            let entry=
                            (<div className="spotify_sumary">
                                <span>{'Created playlist! name: '+body.name}</span><br/>
                                <a href={body.external_urls.spotify}>{body.external_urls.spotify}</a>
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
                }}>Create Playlist
                </button>
                <table>
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
                </table>
            </div>
        </Jumbotron>);
    }
}
ChartPresenter.contextTypes = {
    store: React.PropTypes.object
};
ChartPresenter.propTypes = {};