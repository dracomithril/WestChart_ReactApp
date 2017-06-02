/**
 * Created by Gryzli on 28.01.2017.
 */

import qs from "querystring";
const filters_def = require('./filters_def');
const woc_string = "Wielkie Ogarnianie Charta";

const action_types = require('./reducers/action_types');
/**
 *
 * @param store
 * @returns {{view_chart: (*), error_days: Array.<*>}}
 * @private
 */
export function filterChart(store) {

    let songs_per_day_arr = {};
    let {chart, filters, until, songs_per_day} = store.getState();
    let filterIt = (elem) => {
        let doTest = (filter) => {
            if (filter.type === 'countDays') {
                return filter.check(elem[filter.valueName], until, filters[filter.input.name].days) > 0;
            }
            else {
                return filter.check(elem.reactions_num, filter.input.name, filters)
            }
        };
        let results = filters_def.control.filter(e => {
            return filters[e.input.name].checked
        });
        const map = results.map(doTest);
        let res1 = map.length>0?map.reduce((pr, cr) => pr && cr):true;

        if (!filters.woc_control.checked) {
            res1 &= elem.message !== undefined ? !elem.message.toLowerCase().includes(woc_string.toLowerCase()) : true;
        }
        if (res1 && elem.added_time !== undefined) {
            if (songs_per_day_arr[elem.added_time]) {
                songs_per_day_arr[elem.added_time].count++
            } else {
                songs_per_day_arr[elem.added_time] = {
                    count: 1,
                    org: elem.added_time
                };
            }
        }
        return res1;
    };
    const view_chart = chart.filter(filterIt);
    let error_days = Object.keys(songs_per_day_arr).filter(key => {
        return songs_per_day_arr[key].count !== songs_per_day
    }).map(elem => {
        const songsPerDay = songs_per_day_arr[elem];
        songsPerDay.color = songs_per_day_arr[elem].count > songs_per_day ? 'red' : 'blue';
        return songsPerDay
    });

    return {view_chart, error_days};
}
export const sorting = {
    /**
     * descending
     * @param array
     */
    reaction: (array) => {
        array.sort((a, b) => b.reactions_num - a.reactions_num)
    },
    /**
     * ascending
     * @param array
     */
    who: (array) => {
        array.sort((a, b) => {
            if (a.from_user < b.from_user)
                return -1;
            if (a.from_user > b.from_user)
                return 1;
            return 0;
        });

    },
    /**
     * ascending
     * @param array
     */
    when: (array) => {
        array.sort((a, b) => (a.added_time ? a.added_time.getTime() : 0) - (b.added_time ? b.added_time.getTime() : 0));
    },
    /**
     * ascending
     * @param array
     */
    what: (array) => {
        array.sort((a, b) => {
            if (a.link.name < b.link.name)
                return -1;
            if (a.link.name > b.link.name)
                return 1;
            return 0;
        });
    }
};
export const getChartFromServer = function (query_params, store) {
    let url = '/api/get_chart?' + qs.stringify(query_params);
    console.time('client-obtain-chart');
    return fetch(url)
        .then((resp) => {
            console.log('obtained chart list');
            console.timeEnd('client-obtain-chart');
            if (resp.status === 200) {
                return resp.json()
            }
            return Promise.reject(resp);
        })
        .then((b) => {
            store.dispatch({type: action_types.UPDATE_CHART, chart: b.chart});
            store.dispatch({type: action_types.UPDATE_LAST_UPDATE, date: b.last_update});
            store.dispatch({type: action_types.CHANGE_SHOW_WAIT, show: false});

        })
        .catch(err => {
            store.dispatch({type: action_types.CHANGE_SHOW_WAIT, show: false});
            console.error('Error in fetch chart.');
            console.error(err);
        });
};

export const UpdateChart = function (store) {
    store.dispatch({type: action_types.CHANGE_SHOW_WAIT, show: true});
    const {user, enable_until, start_date, show_last} = store.getState();

    let until = enable_until ? start_date.toDate() : new Date();

    let since = filters_def.subtractDaysFromDate(until, show_last);
    const since2 = since.toISOString();
    const until2 = until.toISOString();
    store.dispatch({type: 'UPDATE_SINCE', date: since2});
    store.dispatch({type: 'UPDATE_UNTIL', date: until2});

    const query_params = {
        days: undefined,
        since: since2,
        until: until2,
        access_token: user.accessToken
    };
    getChartFromServer(query_params, store);
};

export const getArtist_Title = function (name) {
    /** regex for artist title
     *[group 1-2] youtube
     *[group 1] artist
     * [group 2] title
     *[group 3-4] spotify
     * [group 3] title
     * [group 4] artist
     */
    const regex = /^(.*?)\s-\s(.*?)(?:\s[([](?:[Oo]ff.*l.*(?:[Vv]ideo|[Aa]udio)?|(?:Audio)?)[)\]])?(?:\sft.(.*)?)?$|^(.*?)(?:,\s.*s.*by)\s(.*?)(?:\son.*[Ss]potify)$/g;
    let title, artist;
    const m = regex.exec(name);
    if (m === null) {
        return {title: name, artist: null}
    }
    if (m[1] && m[2]) {
        artist = m[1];
        title = m[2];
    } else {
        artist = m[5];
        title = m[4];
    }
    return {title, artist}
};

const exp = {
    filterChart,
    sorting,
    subtractDaysFromDate: filters_def.subtractDaysFromDate,
    woc_string,
    getChartFromServer, getArtist_Title, UpdateChart
};
module.exports = exp;
export default {
    filterChart,
    sorting,
    subtractDaysFromDate: filters_def.subtractDaysFromDate,
    woc_string,
    getChartFromServer,
    getArtist_Title,
    UpdateChart
}
