/**
 * Created by Gryzli on 05.04.2017.
 */

import moment from "moment";
let showDays = 7;
let _ = require('lodash');
const action_types = require('./action_types');
let map_user = (response) => {
    let isGroupAdmin = response.groups.data.filter((elem) => elem.id === '1707149242852457' && elem.administrator === true);
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
        isGroupAdmin: isGroupAdmin
    };
};
const create_control = (control, action) => {
    if (control.id === action.id) {
        switch (action.type) {
            case action_types.TOGGLE_FILTER:
                return Object.assign({}, control, {checked: action.checked});
            case action_types.UPDATE_DAYS:
                return Object.assign({}, control, {days: action.value});
            default:
                return control;
        }
    } else {
        return control;
    }
};

const user = (state = {}, action) => {
    switch (action.type) {
        case action_types.UPDATE_USER:
            const response = action.response;
            if (!response.error) {
                return map_user(response);
            } else {
                console.error('login error.');
                console.error(response.error);
                break;
            }
        default:
            return state;
    }
};
const sp_user = (state = {}, action) => {
    switch (action.type) {
        case action_types.UPDATE_SP_USER:
            return Object.assign({}, state, action.user, {
                access_token: action.access_token,
                refresh_token: action.refresh_token
            });
        case action_types.UPDATE_SP_USER_PLAYLIST:
            return {
                ...state,
                playlists: action.playlists
            };
        default:
            return state;
    }
};


const chart = (state = [], action) => {
    switch (action.type) {
        case action_types.UPDATE_CHART:
            return action.chart;
        case action_types.TOGGLE_SELECTED:
            let l = _.clone(state);
            l[action.id].selected = action.checked;
            return l;
        case action_types.TOGGLE_ALL:
            return state.map((elem) => {
                let copy = _.clone(elem);
                copy.selected = !elem.selected;
                return copy
            });
        default:
            return state;
    }
};
const list_sort = (state = 'reaction', action) => {
    return action.type === action_types.UPDATE_LIST_SORT ? action.sort : state;
};
const search_list = (state = [], action) => {
    switch (action.type) {
        case action_types.UPDATE_SEARCH:
            return action.search;
        case action_types.UPDATE_SINGLE_SEARCH:
            let entry = _.clone(state);
            const entry2 = entry[action.id];
            entry2[action.field] = action.value;
            if (action.field === 'items') {
                entry2.selected = action.value[0];
            }
            return entry;
        case action_types.SWAP_FIELDS:
            let entry1 = _.clone(state);
            const artist = entry1[action.id].artist;
            const title = entry1[action.id].title;
            entry1[action.id].artist = title;
            entry1[action.id].title = artist;
            return entry1;
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
const enable_until = (state = false, action) => {
    return action.type === action_types.TOGGLE_ENABLE_UNTIL ? action.checked : state;
}
const sp_playlist_name = (state = '', action) => {
    return action.type === action_types.UPDATE_PLAYLIST_NAME ? action.value : state;
};
/**
 *
 * @param state {string}
 * @param action {object}
 * @returns {string}
 */
const last_update = (state = '', action) => {
    return action.type === action_types.UPDATE_LAST_UPDATE ? action.date : state;
};
const show_wait = (state = false, action) => {
    return action.type === action_types.CHANGE_SHOW_WAIT ? action.show : state;
};

const start_date = (state = moment(), action) => {
    return action.type === action_types.UPDATE_START_TIME ? action.date : state;
};
const since = (state = '', action) => {
    return action.type === action_types.UPDATE_SINCE ? action.date : state;
};
const until = (state = '', action) => {
    return action.type === action_types.UPDATE_UNTIL ? action.date : state;
};
const songs_per_day = (state = 2, action) => {
    return action.type === action_types.UPDATE_SONGS_PER_DAY ? action.days : state;
};
const show_last = (state = 31, action) => {
    return action.type === action_types.UPDATE_SHOW_LAST ? action.days : state;
};

const filters = (state = {}, action) => {
    return {
        add_control: create_control(state.add_control || {checked: true, id: 'add', days: showDays}, action),
        create_control: create_control(state.create_control || {checked: false, id: 'create', days: showDays}, action),
        update_control: create_control(state.update_control || {checked: false, id: 'update', days: showDays}, action),
        less_control: create_control(state.less_control || {checked: false, id: 'less', days: 15}, action),
        more_control: create_control(state.more_control || {checked: false, id: 'more', days: 0}, action),
        woc_control: create_control(state.woc_control || {checked: true, id: 'woc_cb'}, action)
    }
};
const errors = (state = [], action) => {
    switch (action.type) {
        case action_types.ADD_ERROR:
            return _.takeRight([action.error, ...state],3);
        case action_types.CLEAR_ERRORS:
            return [];
        default:
            return state;
    }
};
const isPlaylistPrivate = (state = false, action) => {
    return action.type === action_types.TOGGLE_IS_PRIVATE ? action.value : state;
};
const sp_playlist_info = (state = {url: null, pl_name: ''}, action) => {
    return action.type === action_types.UPDATE_PLAYLIST_INFO ? action.value : state;
};
const hasAcCookie= (state = false, action) => {
    return action.type === action_types.TOGGLE_HAS_COOKIE ? action.value : state;
};
let reducers = {
    filters, user, chart, enable_until, last_update, start_date, show_last, since, until, list_sort, songs_per_day,
    sp_user, search_list, sp_playlist_name, show_wait, isPlaylistPrivate, sp_playlist_info, errors, hasAcCookie
};
export default reducers;