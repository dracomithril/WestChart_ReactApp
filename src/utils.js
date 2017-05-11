/**
 * Created by Gryzli on 28.01.2017.
 */

import filters_def from "./filters";
import qs from "querystring";
const woc_string = "Wielkie Ogarnianie Charta";
const url = require('url');
const querystring = require('querystring');
const Cookies = require('cookies-js');
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
    const view_chart = chart.filter((elem) => {
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
        let res1 = map.reduce((pr, cr) => pr && cr);

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
    });
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
export const get_chart_from_server = function (query_params, store) {
    let url = 'api/get_chart?' + qs.stringify(query_params);
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
            // that.setState(b);
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
export const loginToSpotify = function () {
     return fetch('/api/login')
        .then((response) => {
        return response.text()
    }).then((path) => {
        const urlObj = url.parse(path);
        const query = querystring.parse(urlObj.query);
        Cookies.set('spotify_auth_state', query.state);
        console.log(path);
        window.location.assign(path);
        return Promise.resolve();
    }).catch((err) => {
        console.log(err);
    })
};

let exp = {
    filterChart,
    loginToSpotify,
    sorting,
    subtractDaysFromDate: filters_def.subtractDaysFromDate,
    woc_string,
    get_chart_from_server
};
module.exports = exp;
export default {
    filterChart,
    loginToSpotify,
    sorting,
    subtractDaysFromDate: filters_def.subtractDaysFromDate,
    woc_string,
    get_chart_from_server
}
