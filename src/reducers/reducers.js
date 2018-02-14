/**
 * Created by Gryzli on 05.04.2017.
 */

import moment from 'moment';

const showDays = 7;
const _ = require('lodash');
const action_types = require('./action_types');

const map_user = response => {
  const isGroupAdmin =
    response.groups.data.filter(
      elem => elem.id === '1707149242852457' && elem.administrator === true,
    ).length > 0;
  return {
    accessToken: response.accessToken,
    email: response.email,
    first_name: response.first_name,
    expiresIn: response.expiresIn,
    id: response.id,
    name: response.name,
    signedRequest: response.signedRequest,
    userID: response.userID,
    picture_url: response.picture.data.url,
    isGroupAdmin,
  };
};

const user = (state, action) => {
  switch (action.type) {
    case action_types.UPDATE_USER: {
      const { response } = action;
      if (!response.error) {
        const userData = map_user(response);
        sessionStorage.setItem('fb_user', JSON.stringify(userData));
        return userData;
      }
      console.error('login error.');
      console.error(response.error);
      return state;
    }
    case action_types.SIGN_OUT_USER:
      return {};
    case action_types.UPDATE_USER_LS:
      return Object.assign({}, state, action.value);
    default:
      return state || JSON.parse(sessionStorage.getItem('fb_user')) || {};
  }
};

const sp_user = (state, action) => {
  switch (action.type) {
    case action_types.UPDATE_SP_USER: {
      const userData = Object.assign({}, state, action.user, {
        access_token: action.access_token,
        refresh_token: action.refresh_token,
      });
      sessionStorage.setItem('sp_user', JSON.stringify(userData));
      return userData;
    }
    case action_types.SIGN_OUT_USER:
      return {};
    case action_types.UPDATE_SP_USER_PLAYLIST:
      return {
        ...state,
        playlists: action.playlists,
      };
    case action_types.UPDATE_SP_USER_LS:
      return Object.assign({}, state, action.value);
    default: {
      const parse = JSON.parse(sessionStorage.getItem('sp_user'));
      return state || parse || {};
    }
  }
};

const chart = (state = [], action) => {
  switch (action.type) {
    case action_types.UPDATE_CHART:
      // todo change to [...action.chart]
      return action.chart;
    case action_types.TOGGLE_SELECTED: {
      const l = _.clone(state);
      const findIndex = l.findIndex(elem => elem.id === action.id);
      l[findIndex].selected = action.checked;
      return l;
    }
    case action_types.TOGGLE_ALL:
      return state.map(elem => {
        const copy = _.clone(elem);
        copy.selected = !elem.selected;
        return copy;
      });
    default:
      return state;
  }
};
const list_sort = (state = 'reaction', action) =>
  action.type === action_types.UPDATE_LIST_SORT ? action.sort : state;
const search_list = (state = [], action) => {
  switch (action.type) {
    case action_types.UPDATE_SEARCH:
      return action.search;
    case action_types.UPDATE_SINGLE_SEARCH: {
      const entry = _.clone(state);
      const entry2 = entry[action.id];
      entry2[action.field] = action.value;
      if (action.field === 'items') {
        entry2.selected = [...action.value].shift();
      }
      return entry;
    }
    case action_types.SWAP_FIELDS: {
      const entry1 = _.clone(state);
      const { artist, title } = entry1[action.id];
      entry1[action.id].artist = title;
      entry1[action.id].title = artist;
      return entry1;
    }
    default:
      return state;
  }
};
/**
 *
 * @param state {boolean}
 * @param action {object}
 * @returns {boolean}
 */
const enable_until = (state = false, action) =>
  action.type === action_types.TOGGLE_ENABLE_UNTIL ? Boolean(action.checked) : state;
const sp_playlist_name = (state = '', action) =>
  action.type === action_types.UPDATE_PLAYLIST_NAME ? action.value : state;
/**
 *
 * @param state {string}
 * @param action {object}
 * @returns {string}
 */
const last_update = (state = '', action) =>
  action.type === action_types.UPDATE_LAST_UPDATE ? action.date : state;
const start_date = (state = moment(), { type, date }) =>
  type === action_types.UPDATE_START_TIME ? date : state;
const since = (state = 0, action) =>
  action.type === action_types.UPDATE_SINCE ? action.date : state;
const until = (state = 0, action) =>
  action.type === action_types.UPDATE_UNTIL ? action.date : state;
const show_wait = (state = false, action) =>
  action.type === action_types.CHANGE_SHOW_WAIT ? action.show : state;

const songs_per_day = (state = 3, action) =>
  action.type === action_types.UPDATE_SONGS_PER_DAY ? action.days : state;
/**
 * shows days from now or from selected date
 * @param state
 * @param action
 * @returns {number}
 */
const show_last = (state = 31, action) =>
  action.type === action_types.UPDATE_SHOW_LAST ? action.days : state;

/**
 *
 * @param control {Object}
 * @param action {Action}
 * @returns {*}
 */
const control_state = (control, action) => {
  if (control.id === action.id) {
    switch (action.type) {
      case action_types.TOGGLE_FILTER:
        return Object.assign({}, control, { checked: action.checked });
      case action_types.UPDATE_DAYS:
        return Object.assign({}, control, { days: action.value });
      default:
        return control;
    }
  } else {
    return control;
  }
};
const filters = (state = {}, action) => ({
  create_control: control_state(
    state.create_control || { checked: true, id: 'create', days: showDays },
    action,
  ),
  update_control: control_state(
    state.update_control || { checked: false, id: 'update', days: showDays },
    action,
  ),
  // todo less & more should be count or value it shows how many reaction was for post
  less_control: control_state(
    state.less_control || { checked: false, id: 'less', days: 15 },
    action,
  ),
  more_control: control_state(
    state.more_control || { checked: false, id: 'more', days: 0 },
    action,
  ),
  woc_control: control_state(state.woc_control || { checked: true, id: 'woc_cb' }, action),
  westletter_control: control_state(
    state.westletter_control || { checked: true, id: 'westletter_cb' },
    action,
  ),
});
const errors = (state = [], action) => {
  switch (action.type) {
    case action_types.ADD_ERROR:
      return _.takeRight([action.value, ...state], 3);
    case action_types.CLEAR_ERRORS:
      return [];
    default:
      return state;
  }
};

const isPlaylistPrivate = (state = false, action) =>
  action.type === action_types.TOGGLE_IS_PRIVATE ? action.value : state;
const sp_playlist_info = (state = { url: null, pl_name: '' }, action) =>
  action.type === action_types.UPDATE_PLAYLIST_INFO ? action.value : state;
const hasAcCookie = (state = false, action) =>
  action.type === action_types.TOGGLE_HAS_COOKIE ? action.value : state;
const reducers = {
  filters,
  user,
  chart,
  enable_until,
  last_update,
  start_date,
  show_last,
  since,
  until,
  list_sort,
  songs_per_day,
  sp_user,
  search_list,
  sp_playlist_name,
  show_wait,
  isPlaylistPrivate,
  sp_playlist_info,
  errors,
  hasAcCookie,
};
export default reducers;
