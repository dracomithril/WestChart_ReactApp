/**
 * Created by Gryzli on 05.04.2017.
 */

import moment from "moment";
let showDays = 7;
let _ = require('lodash');
const create_control = (control, action) => {
    if (control.id === action.id) {
        switch (action.type) {
            case 'TOGGLE_FILTER':
                return Object.assign({}, control, {checked: action.checked});
            case 'UPDATE_DAYS':
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
        case 'UPDATE_USER':
            return action.user;
        default:
            return state;
    }
};
const chart = (state = [], action) => {
    switch (action.type) {
        case 'UPDATE_CHART':
            return action.chart;
        case 'TOGGLE_SELECTED':
            let l = _.clone(state);
            l[action.id].selected = action.checked;
            return l;
        case 'TOGGLE_ALL':
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
    return action.type === 'UPDATE_LIST_SORT' ? action.sort : state;
};

/**
 *
 * @param state {boolean}
 * @param action {object}
 * @returns {boolean}
 */
const enable_until = (state = false, action) => {
    return action.type === 'TOGGLE_ENABLE_UNTIL' ? action.checked : state;
};
/**
 *
 * @param state {string}
 * @param action {object}
 * @returns {string}
 */
const last_update = (state = '', action) => {
    return action.type === 'UPDATE_LAST_UPDATE' ? action.date : state;
};

const start_date = (state = moment(), action) => {
    return action.type === 'UPDATE_START_TIME' ? action.date : state;
};
const since = (state = '', action) => {
    return action.type === 'UPDATE_SINCE' ? action.date : state;
};
const until = (state = '', action) => {
    return action.type === 'UPDATE_UNTIL' ? action.date : state;
};
const songs_per_day = (state = 2, action) => {
    return action.type === 'UPDATE_SONGS_PER_DAY' ? action.days : state;
};
const show_last = (state = 31, action) => {
    return action.type === 'UPDATE_SHOW_LAST' ? action.days : state;
};

const filters = (state = {}, action) => {
    return {
        add_control: create_control(state.add_control || {checked: true, id: 'add', days: showDays}, action),
        create_control: create_control(state.create_control || {checked: false, id: 'create', days: showDays}, action),
        update_control: create_control(state.update_control || {checked: false, id: 'update', days: showDays}, action),
        less_control: create_control(state.less_control || {checked: false, id: 'less', days: 15}, action),
        more_control: create_control(state.more_control || {checked: false, id: 'more', days: 0}, action),
        woc_control: create_control(state.woc_control || {checked: true, id: 'woc'}, action)
    }
};
let reducers = {
    filters, user, chart, enable_until, last_update, start_date, show_last, since, until, list_sort, songs_per_day
};
export default reducers;