/**
 * Created by Gryzli on 28.01.2017.
 */

import qs from "querystring";

const filters_def = require('./filters_def');


const cookies_name = {
    access_token: 'wcs_sp_user_ac',
    refresh_token: 'wcs_sp_user_refresh_token'
};
Object.freeze(cookies_name);
const action_types = require('./reducers/action_types');
/**
 *
 * @param store
 * @returns {{view_chart: (*), error_days: Array.<*>}}
 * @private
 */

const sorting = {
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

class utils {
    static get cookies_name() {
        return cookies_name;
    };

    static get sorting() {
        return sorting;
    }

    static get subtractDaysFromDate() {
        return filters_def.subtractDaysFromDate;
    }

    static writeUserData(fb_user = {}, sp_user = {}) {
        const data = {
            sp_id: sp_user.id,
            sp_name: sp_user.name,
            fb_name: fb_user.name,
            fb_email: fb_user.email,
            fb_id: fb_user.id
        };
        fetch('/api/user/login/' + fb_user.id, {
            method: 'PUT', body: JSON.stringify(data), headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(res => {
            console.log('data sanded to database ' + res.status)
        });
    }


    static filterChart(store) {

        let songs_per_day_arr = {};
        let {chart, filters, until, songs_per_day} = store.getState();

        const filters_defaults = [...filters_def.control, ...filters_def.text];
        let results = filters_defaults.filter(e => {
            return filters[e.input.name].checked
        }).map(e => {
            return {...e, days: filters[e.input.name].days, until: until};
        });


        let filterIt = (elem) => {
            const map = results.map((filter) => filter.check(elem, filter));
            return map.length > 0 ? map.reduce((pr, cr) => pr && cr) : true;
        };
        const view_chart = chart.filter(filterIt);

        view_chart.forEach(elem => {
            const createdTime = new Date(elem.created_time).toDateString();
            if (songs_per_day_arr[createdTime]) {
                songs_per_day_arr[createdTime].count++
            } else {
                songs_per_day_arr[createdTime] = {
                    count: 1,
                    get color() {
                        return this.count > this._spd ? 'red' : 'blue'
                    },
                    _spd: songs_per_day,
                    org: createdTime
                };
            }
        });
        let error_days = Object.keys(songs_per_day_arr)
            .filter(key => songs_per_day_arr[key].count !== songs_per_day)
            .map(elem => songs_per_day_arr[elem]);
        return {view_chart, error_days};
    }

    static getChartFromServer(query_params) {
        let url = '/api/get_chart?' + qs.stringify(query_params);
        console.time('client-obtain-chart');
        return fetch(url).then((resp) => {
            console.log('obtained chart list');
            console.timeEnd('client-obtain-chart');
            return resp.status === 200 ? resp.json() : Promise.reject(resp);
        });
    };

    static UpdateChart(store) {
        store.dispatch({type: action_types.CHANGE_SHOW_WAIT, show: true});
        const {user, enable_until, start_date, show_last} = store.getState();
        const query_params = this.getQueryParams(enable_until, start_date, show_last, user);
        store.dispatch({type: 'UPDATE_SINCE', date: query_params.since});
        store.dispatch({type: 'UPDATE_UNTIL', date: query_params.until});
        return utils.getChartFromServer(query_params)
            .then((body) => {
                console.log("chart list witch " + body.chart.length);
                store.dispatch({type: action_types.UPDATE_CHART, chart: body.chart});
                store.dispatch({type: action_types.UPDATE_LAST_UPDATE, date: body.last_update});
                store.dispatch({type: action_types.CHANGE_SHOW_WAIT, show: false});
                return Promise.resolve();
            })
            .catch(err => {
                store.dispatch({type: action_types.CHANGE_SHOW_WAIT, show: false});
                store.dispatch({type: action_types.ADD_ERROR, values: err});
                console.error('Error in fetch chart.');
            });
    };

    static getQueryParams(enable_until, start_date, show_last, user) {
        let until = enable_until ? start_date.toDate() : new Date();
        let since = filters_def.subtractDaysFromDate(until, show_last);
        const since2 = since.toISOString();
        const until2 = until.toISOString();

        const query_params = {
            days: show_last,
            since: since2,
            until: until2,
            access_token: user.accessToken
        };
        return query_params;
    }

    static getArtist_Title(name) {
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
}

module.exports = utils;
