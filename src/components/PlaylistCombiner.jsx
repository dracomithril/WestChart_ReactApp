/**
 * Created by Gryzli on 05.06.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {ControlLabel, FormControl, FormGroup, Image, Radio} from "react-bootstrap";
import Spotify from "spotify-web-api-node";
const spotifyApi = new Spotify();

export default class PlaylistCombiner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            chosen: undefined, indexer: [],
            isCurrentUser: true,
            userType: "this_user", userField: undefined,
            users: {}
        }


    }

    componentWillUnmount() {
        console.log('component PlaylistCombiner unmounted');
    }

    componentDidMount() {
        console.log('component PlaylistCombiner did mount');
    }

    render() {
        const {sp_user} = this.context.store.getState();
        const {selected, chosen, indexer, userType, userField, users} = this.state;
        const map_selected = selected.map(elem => {
            return <div key={'sel_' + elem.id}>
                <span>{elem.name}</span>
            </div>
        });
        let map_playlist = (elem) => {
            return <option key={elem.id}>{elem.name}</option>
        };
        const item_list = (sp_user.playlists || []).map(map_playlist);
        const users_playlists = Object.keys(users).map((el) => {
            const m = (users[el].items || []).map(map_playlist);
            return <FormGroup controlId={el} key={el + "_playlists"}>
                <Image style={{width: 40, height: 40, padding: 5}} src={(users[el] || {}).pic}
                       rounded/>
                <ControlLabel>{users[el].id}</ControlLabel>
                <FormControl componentClass="select" multiple>
                    {m}
                </FormControl>
            </FormGroup>
        });
        return (<div>
            <h3>Combiner</h3>
            <div>

                <h5>From: </h5>
                <FormGroup onChange={(e) => {
                    if (e.target.name === 'user') {
                        this.setState({userType: e.target.value});
                    }
                }}>
                    <Radio name="user" id="this_user" value="this_user" defaultChecked={userType === 'this_user'}>
                        <Image style={{width: 40, height: 40, padding: 5}} src={(sp_user.images[0] || {}).url}
                               rounded/>{sp_user.id}
                    </Radio>
                    <Radio name="user" id="dif_user" value="dif_user" defaultChecked={userType === 'dif_user'}>
                        <input type="text" disabled={!(userType === 'dif_user')} value={userField}
                               placeholder="spotify user" onChange={(e) => this.setState({userField: e.target.value})}/>
                        <button disabled={!(userType === 'dif_user')} onClick={() => {
                            console.log(userField);
                            const that = this;
                            spotifyApi.setAccessToken(sp_user.access_token);
                            spotifyApi.getUser(userField)
                                .then(data => {
                                    const user_id = data.body.id;
                                    let new_user = {
                                        pic: (data.body.images[0] || {}).url,
                                        id: user_id
                                    };
                                    const update_user = Object.assign({}, that.state.users[user_id], new_user);
                                    let newUsers = {};
                                    newUsers[user_id] = update_user;
                                    const users_new = Object.assign({}, that.state.users, newUsers);
                                    that.setState({users: users_new});
                                    spotifyApi.getUserPlaylists(user_id)
                                        .then(data => {
                                            let new_user = Object.assign({}, that.state.users[user_id], {items: data.body.items});
                                            let newUsers = {};
                                            newUsers[user_id] = new_user;
                                            const users_new = Object.assign({}, that.state.users, newUsers);
                                            that.setState({users: users_new});
                                            console.log('Retrieved playlists', data.body);
                                        }, (err) => {
                                            console.log('Something went wrong!', err);
                                        });
                                    console.log('Some information about this user', data.body);
                                }, err => {
                                    console.log('Something went wrong!', err);
                                });

                        }}>
                            <i className="fa fa-search"/>
                        </button>
                    </Radio>
                </FormGroup>
                <FormGroup controlId="formControlsSelectMultiple">
                    <ControlLabel>Multiple select</ControlLabel>
                    <FormControl componentClass="select" multiple>
                        {item_list}
                    </FormControl>
                </FormGroup>
                {users_playlists}
                <i className="fa fa-plus" aria-hidden="true" onClick={() => {
                    if (chosen && !indexer.contains(chosen.name)) {
                        this.setState({selected: [...selected, chosen]})
                    }
                }}/>
                {map_selected}
            </div>
            <div style={{border: '1px solid black', background: 'grey'}}>
                <h5>To:</h5>
                <span>Existing playlist</span>
                <select>
                    {item_list}
                </select>
                <span>New playlist</span>
                <input type="text"/>
            </div>
        </div>);
    }
}
PlaylistCombiner.contextTypes = {
    store: PropTypes.object
};
PlaylistCombiner.propTypes = {};