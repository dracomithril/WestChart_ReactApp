/**
 * Created by Gryzli on 05.06.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Button, ButtonGroup, ControlLabel, FormControl, FormGroup, Image, Badge} from "react-bootstrap";
import {getTracks, getUserAndPlaylists, createPlaylistAndAddTracks} from "./../spotify_utils";
import PlaylistInfo from './PlaylistInfo';
const _ = require('lodash');
const action_types = require('./../reducers/action_types');
//todo add modal to block usage of tool when playlist crating
const UserPlaylist = (props) => {
    let user = props.user || {};
    const items = (user.items || []).map((elem) => {
        return <option key={elem.id} value={elem.id}>{elem.name + " - " + ((elem.tracks || {}).total || 0)}</option>
    });
    return <FormGroup controlId={user.id + '_playlist'} bsClass="playlists_view form-group">
        <div>
            <ControlLabel> <Image src={user.pic} rounded/>
                <span>{user.id.length > 12 ? user.id.substr(0, 9) + '...' : user.id}</span>
            </ControlLabel><Badge
            bsStyle="warning">{user.total}</Badge>
            <ButtonGroup>
                <Button className="fa fa-refresh" onClick={() => props.onUpdate(user.id)}/>
                <Button className="fa fa-minus" onClick={() => props.onDelete(user.id)} disabled={!props.erasable}/>
            </ButtonGroup>
        </div>
        <FormControl name={user.id} componentClass="select" multiple onChange={(e) => {
            let name = e.target.name;
            let sel = [];
            for (let el of e.target.selectedOptions) {
                sel.push([name, el.value])
            }
            props.onSelect(name, sel);
        }}>
            {items}
        </FormControl>
    </FormGroup>
};
UserPlaylist.propTypes = {
    user: PropTypes.object,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onSelect: PropTypes.func,
    erasable: PropTypes.bool
};


export default class PlaylistCombiner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            chosen: undefined,
            indexer: [],
            isCurrentUser: true,
            userType: "this_user",
            userField: "",
            users: {},
            new_playlist: "",
            sp_playlist_info: {
                url: null
            }
        };
        this.getUserInformation = this.getUserInformation.bind(this);
        this.deleteUserPlaylist = this.deleteUserPlaylist.bind(this);
        this.updateSelectedPlaylist = this.updateSelectedPlaylist.bind(this);
        this.combinePlaylists = this.combinePlaylists.bind(this);
        this.searchForUser_click = this.searchForUser_click.bind(this);
    }

    componentWillUnmount() {
        console.log('component PlaylistCombiner unmounted');
    }

    searchForUser_click() {
        const {users, userField} = this.state;
        if (Object.keys(users).length < 3) {
            this.getUserInformation(userField).then(() => this.setState({userField: ""}));
        } else {
            alert('Sorry you can only combine list from 3 users. Delete one of users to add new one.')
        }
    }

    getUserInformation(user) {
        console.log('get ' + user);
        const that = this;
        let store = this.context.store;
        const {sp_user} = store.getState();

        let updateUsers = function (new_user) {
            const user = that.state.users[new_user.id];
            let newUsers = {};
            newUsers[new_user.id] = Object.assign({}, user, new_user);
            return {users: Object.assign({}, that.state.users, newUsers)};
        };
        return getUserAndPlaylists(sp_user.access_token, user).then(new_user => {
            that.setState(updateUsers(new_user));
            console.log('Retrieved playlists ', new_user);
            return Promise.resolve(new_user.id);
        }).catch(e => {
            store.dispatch({type: action_types.ADD_ERROR, value: e})
        });

    }

    combinePlaylists() {
        //todo check if playlist exists
        let store = this.context.store;
        const {sp_user} = store.getState();
        const {selected, new_playlist} = this.state;
        let array = _.flatMap(selected, n => n);
        let actions = array.map(el => getTracks(sp_user.access_token, ...el));
        Promise.all(actions).then(data => {
            console.log('all done!!!');
            let flat_tracks = _.flatMap(data, n => n);// [].concat.apply([], data);
            let uniq = _.uniq(flat_tracks);
            return createPlaylistAndAddTracks(sp_user, new_playlist, false, uniq).then(d => {
                console.log(d);
                this.setState({sp_playlist_info: d});
                this.getUserInformation(sp_user.id);
            })
        }).catch(e => {
            store.dispatch({type: action_types.ADD_ERROR, value: e})
        });
    }

    deleteUserPlaylist(user_id) {
        console.log('delete ' + user_id);
        const users_new = Object.assign({}, this.state.users);
        delete users_new[user_id];
        this.setState({users: users_new});

    }

    updateSelectedPlaylist(user, selected) {
        let that = this;
        let updateSelected = (id, arr) => {
            let newSelected = {};
            newSelected[id] = arr;
            return {selected: Object.assign({}, that.state.selected, newSelected)};
        };
        this.setState(updateSelected(user, selected));
    }

    componentDidMount() {
        console.log('component PlaylistCombiner did mount');
        const {sp_user} = this.context.store.getState();
        this.getUserInformation(sp_user.id);
    }

    render() {
        const {sp_user} = this.context.store.getState();
        const {userField, users, sp_playlist_info} = this.state;
        const users_playlists = Object.keys(users).map((el) => {
            return <UserPlaylist user={users[el]} key={el + "_playlists"}
                                 onUpdate={this.getUserInformation} onDelete={this.deleteUserPlaylist}
                                 onSelect={this.updateSelectedPlaylist}
                                 erasable={(users[el] || {}).id !== sp_user.id}/>
        });
        return (<div>
                <h3>Combiner<strong style={{color:'red'}}>(BETA)</strong></h3>
                <div>
                <span>
                    Combiner gets only 50 last active playlists from your spotify account and from that list selects
                    only playlists that belongs to the user that you are looking for.
                Right now there is no simple way to look for users using their Name or Surname. Only valid 'spotify id' is valid.
                    If account is created using Facebook creation 'spotify id' is number that is hard to obtain. Sorry we will work on it.
                </span>
                </div>
                <PlaylistInfo info={sp_playlist_info}/>
                <div style={{display: 'inline-block'}}>
                    <div id="from_playlist">
                        <label>{"From: "}
                            <input type="text" value={userField} placeholder="spotify user name" autoComplete="on"
                                   onChange={(e) => this.setState({userField: e.target.value})} onKeyPress={(e) => {
                                if (e.which === 13) {
                                    this.searchForUser_click()
                                }
                            }}/>
                        </label>
                        <Button type="submit" onClick={this.searchForUser_click} className="fa fa-search"/>
                        < div
                            className="playlists_view_conteiner">
                            {users_playlists}
                        </div>
                    </div>
                    <div id="destination_panel">
                        <h5>To:</h5>
                        <label>{"New playlist "}
                            <input type="text" placeholder="new playlist" value={this.state.new_playlist}
                                   onChange={event => this.setState({new_playlist: event.target.value})}/>
                        </label>
                        <Button onClick={this.combinePlaylists}>Combine</Button>
                    </div>
                </div>
            </div>
        );
    }
}
PlaylistCombiner.contextTypes = {
    store: PropTypes.object
};
PlaylistCombiner.propTypes = {};