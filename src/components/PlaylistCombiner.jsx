/**
 * Created by Gryzli on 05.06.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";
import {
  addTrucksToPlaylistNoRepeats,
  createPlaylistAndAddTracks,
  getTracks,
  getUserAndPlaylists
} from "./../spotify_utils";
import PlaylistInfo from './PlaylistInfo';
import UserPlaylist from './UserPlaylist';

const _ = require('lodash');
const action_types = require('./../reducers/action_types');
//todo add modal to block usage of tool when playlist crating
const cf = {
  existing: "existing",
  new_list: "new_list"
};
export default class PlaylistCombiner extends React.Component {
  state = {
    selected: [],
    chosen: undefined,
    indexer: [],
    isCurrentUser: true,
    userType: "this_user",
    userField: "",
    users: {},
    createFrom: cf.existing,
    new_playlist: "",
    sp_playlist_info: {
      url: null
    }
  };

  componentWillUnmount() {
    console.log('component PlaylistCombiner unmounted');
  }

  searchForUser_click = () => {
    const { users, userField } = this.state;
    if (Object.keys(users).length < 3) {
      this.getUserInformation(userField).then(() => this.setState({ userField: "" }));
    } else {
      alert('Sorry you can only combine list from 3 users. Delete one of users to add new one.')
    }
  };

  getUserInformation = (user) => {
    if (user === undefined) {
      console.log('get ' + user);
      const that = this;
      let store = this.context.store;
      const { sp_user } = store.getState();

      let updateUsers = function(new_user) {
        const user = that.state.users[new_user.id];
        let newUsers = {};
        newUsers[new_user.id] = Object.assign({}, user, new_user);
        return { users: Object.assign({}, that.state.users, newUsers) };
      };
      return getUserAndPlaylists(sp_user.access_token, user).then(new_user => {
        that.setState(updateUsers(new_user));
        console.log('Retrieved playlists ', new_user);
        return Promise.resolve(new_user.id);
      }).catch(e => {
        store.dispatch({ type: action_types.ADD_ERROR, value: e })
      });
    }

  };

  combinePlaylists = () => {
    //todo check if playlist exists
    let store = this.context.store;
    let createFrom_selected = document.getElementById("select_user_playlist").value;
    const { sp_user } = store.getState();
    const { selected, new_playlist, createFrom } = this.state;
    let array = _.flatMap(selected, n => n);

    let actions = array.map(el => getTracks(sp_user.access_token, ...el));
    Promise.all(actions).then(data => {
      console.log('all done!!!');
      let flat_tracks = _.flatMap(data, n => n);// [].concat.apply([], data);
      let uniq = _.uniq(flat_tracks);
      return (createFrom === cf.existing ? addTrucksToPlaylistNoRepeats(sp_user.id, createFrom_selected, uniq) : createPlaylistAndAddTracks(sp_user, new_playlist, false, uniq)).then(d => {
        console.log(d);
        this.setState({ sp_playlist_info: d });
        this.getUserInformation(sp_user.id);
        this.forceUpdate();
      })
    }).catch(e => {
      store.dispatch({ type: action_types.ADD_ERROR, value: e })
    });

  };

  deleteUserPlaylist = (user_id) => {
    console.log('delete ' + user_id);
    const users_new = Object.assign({}, this.state.users);
    delete users_new[user_id];
    this.setState({ users: users_new });

  };

  updateSelectedPlaylist = (user, selected) => {
    let that = this;
    let updateSelected = (id, arr) => {
      let newSelected = {};
      newSelected[id] = arr;
      return { selected: Object.assign({}, that.state.selected, newSelected) };
    };
    this.setState(updateSelected(user, selected));
  };

  componentDidMount = () => {
    console.log('component PlaylistCombiner did mount');
    const { store } = this.context;
    const { sp_user, user } = store.getState();
    if (!sp_user.id && !user.id) {
      const sp_user_ls = JSON.parse(sessionStorage.getItem('sp_user'));
      const fb_user = JSON.parse(sessionStorage.getItem('fb_user'));
      store.dispatch({ type: action_types.UPDATE_SP_USER_LS, value: sp_user_ls });
      store.dispatch({ type: action_types.UPDATE_USER_LS, value: fb_user });
      this.getUserInformation(sp_user_ls.id);
    }
    this.getUserInformation(sp_user.id);
  };

  render() {
    const { sp_user } = this.context.store.getState();
    const { userField, users, sp_playlist_info, createFrom } = this.state;
    const users_playlists = Object.keys(users).map((el) => {
      return <UserPlaylist user={users[el]} key={el + "_playlists"}
                           onUpdate={this.getUserInformation} onDelete={this.deleteUserPlaylist}
                           onSelect={this.updateSelectedPlaylist}
                           erasable={(users[el] || {}).id !== sp_user.id}/>
    });
    const user_playlists = ((users[sp_user.id] || {}).items || []).map(UserPlaylist.mapUserPlaylistToOptions);
    let newList_checked = cf.new_list === createFrom;
    let existing_checked = cf.existing === createFrom;
    let updateSelected = (e) => this.setState({
      createFrom: e.target.id
    });
    return (<div className="App">
        <h3>Combiner<strong style={{ color: 'red' }}>(BETA)</strong></h3>
        <div>
                <span>
                    Combiner gets only 50 last active playlists from your spotify account and from that list selects
                    only playlists that belongs to the user that you are looking for.
                Right now there is no simple way to look for users using their Name or Surname. Only valid 'spotify id' is valid.
                    If account is created using Facebook creation 'spotify id' is number that is hard to obtain. Sorry we will work on it.
                </span>
        </div>
        <PlaylistInfo info={sp_playlist_info}/>
        <div style={{ display: 'inline-block' }}>
          <div id="from_playlist">
            <label>{"From: "}
              <input type="text" value={userField} placeholder="spotify user name" autoComplete="on"
                     onChange={(e) => this.setState({ userField: e.target.value })} onKeyPress={(e) => {
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
            <div>
              <input type={"radio"} id={cf.existing}
                     checked={existing_checked}
                     onChange={updateSelected}/>
              <label target="select_user_playlist">{"Existing List "}</label>
              <br/>
              <select id="select_user_playlist" disabled={!existing_checked}>{user_playlists}</select>
              <br/>
              <input type={"radio"} id={cf.new_list}
                     checked={newList_checked}
                     onChange={updateSelected}/>
              <label target={cf.new_list + "_txt"}>{"New playlist"}
              </label><br/>
              <input type="text" id={cf.new_list + "_txt"} disabled={!newList_checked}
                     placeholder="new playlist" value={this.state.new_playlist}
                     onChange={event => this.setState({ new_playlist: event.target.value })}/>
            </div>
            <Button onClick={this.combinePlaylists} bsStyle="danger">Combine</Button>
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