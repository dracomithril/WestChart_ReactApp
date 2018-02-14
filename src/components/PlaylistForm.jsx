/**
 * Created by Gryzli on 10.04.2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Form, FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import spotify_utils from './../spotify_utils';
import utils from '../utils';

const action_types = require('./../reducers/action_types');

export default class PlaylistForm extends Component {
  /* istanbul ignore next */
  componentDidMount() {
    console.info('component PlaylistForm did mount');
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    console.info('component PlaylistForm unmounted');
  }

  onStartClick = () => {
    const { store } = this.context;
    const { selected } = this.props;
    const search = selected.map((elem, search_id) => {
      const entry = utils.getArtist_Title(elem.link.title);
      const search_track = {
        artist: entry.artist,
        title: entry.title,
        full_title: elem.link.title,
        id: elem.id,
        search_id,
        items: [],
        selected: {},
      };
      spotify_utils.searchForMusic(search_track, store).then(res =>
        store.dispatch({
          type: action_types.UPDATE_SINGLE_SEARCH,
          field: 'items',
          value: res.value,
          id: res.id,
        }),
      );
      return search_track;
    });
    store.dispatch({ type: action_types.UPDATE_SEARCH, search });
  };

  onGenPlaylistName = () => {
    const { store } = this.context;
    const { monday, friday } = utils.weekInfo(new Date());

    const monday_str = monday
      .toLocaleString('en-US', { month: 'short', day: 'numeric' })
      .toUpperCase();
    const friday_str = friday
      .toLocaleString('en-US', { month: 'short', day: 'numeric' })
      .toUpperCase();

    const playlist_name = `Chart_${monday_str}-${friday_str}`;
    const list = playlist_name.split(' ').join('_');
    store.dispatch({ type: action_types.UPDATE_PLAYLIST_NAME, value: list });
  };

  onCreatePlaylist = () => {
    const { store } = this.context;
    const { search_list, sp_user, sp_playlist_name, isPlaylistPrivate } = store.getState();
    const selected = search_list
      .map(elem => (elem.selected !== undefined ? elem.selected.uri : undefined))
      .filter(elem => elem !== undefined);
    spotify_utils
      .createPlaylistAndAddTracks(sp_user, sp_playlist_name, isPlaylistPrivate, selected)
      .then(info =>
        store.dispatch({
          type: action_types.UPDATE_PLAYLIST_INFO,
          value: info,
        }),
      );
  };

  render() {
    const { store } = this.context;
    const { sp_playlist_name, isPlaylistPrivate } = store.getState();
    const { selected } = this.props;
    const disable_create = !(sp_playlist_name.length > 5 && selected.length > 0);
    const validatePlaylistName = strLength => {
      if (strLength > 8) {
        return 'success';
      }
      return strLength > 5 ? 'warning' : 'error';
    };
    return (
      <Form inline>
        <Button onClick={this.onStartClick} id="start_sp_button" bsStyle="success">
          Start
        </Button>
        <FormGroup
          style={{ margin: '1px 5px 5px 5px' }}
          controlId="play_list_name"
          validationState={validatePlaylistName(sp_playlist_name.length)}
        >
          <InputGroup style={{ maxWidth: 250 }}>
            <FormControl
              type="text"
              placeholder="playlist name"
              value={sp_playlist_name}
              onChange={e => {
                store.dispatch({
                  type: action_types.UPDATE_PLAYLIST_NAME,
                  value: e.target.value,
                });
              }}
            />
            <FormControl.Feedback />
            {/* <InputGroup.Addon><Glyphicon glyph="music"/></InputGroup.Addon> */}
          </InputGroup>
        </FormGroup>
        <ButtonGroup>
          <Button onClick={this.onGenPlaylistName} id="genName_sp_button" bsStyle="primary">
            gen. name
          </Button>
          <Button
            id="crt_pl_button"
            onClick={this.onCreatePlaylist}
            disabled={disable_create}
            bsStyle="danger"
          >
            <i className="fa fa-save" /> Playlist
          </Button>
        </ButtonGroup>
        <label htmlFor="play_list_is_private">
          <input
            type="checkbox"
            id="play_list_is_private"
            onChange={e => {
              store.dispatch({
                type: action_types.TOGGLE_IS_PRIVATE,
                value: e.target.checked,
              });
            }}
            value="private"
            checked={isPlaylistPrivate}
          />
          {'private ?'}
        </label>
      </Form>
    );
  }
}
PlaylistForm.contextTypes = {
  store: PropTypes.object,
};
PlaylistForm.propTypes = {
  selected: PropTypes.array,
};
