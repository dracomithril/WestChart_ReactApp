/**
 * Created by Gryzli on 05.06.2017.
 */
import React from 'react';
import { Button } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import {
  addTrucksToPlaylistNoRepeats,
  createPlaylistAndAddTracks,
  getTracks,
  getUserAndPlaylists,
} from './../spotify_utils';
import PlaylistInfo from './PlaylistInfo';
import UserPlaylist from './UserPlaylist';

import action_types from './../reducers/action_types';

const _ = require('lodash');
// todo add modal to block usage of tool when playlist crating
const cf = {
  existing: 'existing',
  new_list: 'new_list',
};
export default class PlaylistCombiner extends React.Component {
  state = {
    selected: [],
    userField: '',
    users: {},
    createFrom: cf.existing,
    new_playlist: '',
    sp_playlist_info: {
      url: null,
    },
  };

  componentDidMount() {
    const { store } = this.context;
    const { sp_user } = store.getState();
    this.getUserInformation(sp_user.id);
  }

  getUserInformation = user => {
    if (user) {
      const { state, context: { store } } = this;
      const { sp_user } = store.getState();
      const updateUsers = (users, new_user) => {
        const newUsers = {
          [new_user.id]: Object.assign({}, users[new_user.id], new_user),
        };
        return { users: Object.assign({}, users, newUsers) };
      };
      return getUserAndPlaylists(sp_user.access_token, user)
        .then(new_user => {
          this.setState(updateUsers(state.users, new_user));
          console.info('Retrieved playlists ', new_user);
          return Promise.resolve(new_user.id);
        })
        .catch(e => {
          store.dispatch({ type: action_types.ADD_ERROR, value: e });
          store.dispatch({ type: action_types.SIGN_OUT_USER });
          sessionStorage.removeItem('fb_user');
          sessionStorage.removeItem('sp_user');
          return Promise.resolve();
        });
    }
    return Promise.resolve();
  };
  searchForUser_click = () => {
    const { users, userField } = this.state;
    if (Object.keys(users).length < 3) {
      this.getUserInformation(userField).then(() => this.setState({ userField: '' }));
    } else {
      alert('Sorry you can only combine list from 3 users. Delete one of users to add new one.');
    }
  };
  combinePlaylists = () => {
    // todo check if playlist exists
    const { store } = this.context;
    const createFrom_selected = document.getElementById('select_user_playlist').value;
    const { sp_user } = store.getState();
    const { selected, new_playlist, createFrom } = this.state;
    const array = _.flatMap(selected, n => n);

    const actions = array.map(el => getTracks(sp_user.access_token, ...el));
    Promise.all(actions)
      .then(data => {
        console.debug('all done!!!');
        const flat_tracks = _.flatMap(data, n => n); // [].concat.apply([], data);
        const uniq = _.uniq(flat_tracks);
        return createFrom === cf.existing
          ? addTrucksToPlaylistNoRepeats(sp_user.id, createFrom_selected, uniq)
          : createPlaylistAndAddTracks(sp_user, new_playlist, false, uniq);
      })
      .then(d => {
        this.setState({ sp_playlist_info: d });
        this.getUserInformation(sp_user.id);
        this.forceUpdate();
      })
      .catch(e => {
        store.dispatch({ type: action_types.ADD_ERROR, value: e });
      });
  };

  deleteUserPlaylist = user_id => {
    console.info(`delete ${user_id}`);
    const users_new = Object.assign({}, this.state.users);
    delete users_new[user_id];
    this.setState({ users: users_new });
  };

  updateSelectedPlaylist = (user, selectedPlaylist) => {
    const that = this;
    const updateSelected = (id, arr) => {
      const newSelected = {};
      newSelected[id] = arr;
      return { selected: Object.assign({}, that.state.selected, newSelected) };
    };
    this.setState(updateSelected(user, selectedPlaylist));
  };

  render() {
    const { sp_user } = this.context.store.getState();
    const { userField, users, sp_playlist_info, createFrom } = this.state;
    const users_playlists = Object.keys(users).map(user => (
      <UserPlaylist
        user={users[user]}
        key={`${user}_playlists`}
        onUpdate={this.getUserInformation}
        onDelete={this.deleteUserPlaylist}
        onSelect={this.updateSelectedPlaylist}
        erasable={(users[user] || {}).id !== sp_user.id}
      />
    ));
    const user_playlists = ((users[sp_user.id] || {}).items || []).map(
      UserPlaylist.mapUserPlaylistToOptions,
    );
    const newList_checked = cf.new_list === createFrom;
    const existing_checked = cf.existing === createFrom;
    const updateSelected = ({ target }) => {
      this.setState({
        createFrom: target.id,
      });
    };
    return (
      <div className="App">
        <h3>
          Combiner<strong style={{ color: 'red' }}>(BETA)</strong>
        </h3>
        <div>
          <span>
            {`Combiner gets only 50 last active playlists from your spotify account and from that list
            selects only playlists that belongs to the user that you are looking for. Right now
            there is no simple way to look for users using their Name or Surname. Only valid
            'spotify id' is valid. If account is created using Facebook creation 'spotify id' is
            number that is hard to obtain. Sorry we will work on it.`}
          </span>
        </div>
        <PlaylistInfo info={sp_playlist_info} />
        <div style={{ display: 'inline-block' }}>
          <div id="from_playlist">
            <label htmlFor="user_id_input">
              {'From: '}
              <input
                type="text"
                id="user_id_input"
                value={userField}
                placeholder="spotify user name"
                autoComplete="on"
                onChange={e => this.setState({ userField: e.target.value })}
                onKeyPress={({ which }) => {
                  if (which === 13) {
                    this.searchForUser_click();
                  }
                }}
              />
            </label>
            <Button type="submit" onClick={this.searchForUser_click} className="fa fa-search" />
            <div className="playlists_view_conteiner">{users_playlists}</div>
          </div>
          <div id="destination_panel">
            <h5>To:</h5>
            <div>
              <input
                type="radio"
                id={cf.existing}
                checked={existing_checked}
                onChange={updateSelected}
              />
              <label htmlFor="select_user_playlist">Existing List </label>
              <br />
              <select id="select_user_playlist" disabled={!existing_checked}>
                {user_playlists}
              </select>
              <br />
              <input
                type="radio"
                id={cf.new_list}
                checked={newList_checked}
                onChange={updateSelected}
              />
              <label htmlFor={`${cf.new_list}_txt`}>
                New playlist
                <br />
                <input
                  type="text"
                  id={`${cf.new_list}_txt`}
                  disabled={!newList_checked}
                  placeholder="new playlist"
                  value={this.state.new_playlist}
                  onChange={event => this.setState({ new_playlist: event.target.value })}
                />
              </label>
            </div>
            <Button onClick={this.combinePlaylists} bsStyle="danger">
              Combine
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
PlaylistCombiner.contextTypes = {
  store: PropTypes.object,
};
PlaylistCombiner.propTypes = {};
