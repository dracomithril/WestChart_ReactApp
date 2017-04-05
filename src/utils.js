/**
 * Created by Gryzli on 28.01.2017.
 */

import filters from './filters';
const woc_string = "Wielkie Ogarnianie Charta";




/**
 *
 * @param state
 * @param store
 * @returns {{view_chart: (*), error_days: Array.<*>}}
 * @private
 */
function _filterChart(state,store) {

    let songs_per_day = {};
    let view_chart = state.chart;
let state2 = store.getState();
    const until = state.until;
    const wOC = state2.filters.woc_control.checked;


    view_chart = view_chart.filter((elem) => {
        let doTest = (filter) => {
            if (filter.check.name === 'countDays') {
                return filter.check(elem[filter.valueName], until, state2.filters[filter.input.name].days) > 0;
            }
            else {
                return filter.check(elem, filter.input.name, state)
            }
        };
        let results = filters.control.filter(e => state2.filters[e.input.name].checked);
        const map = results.map(doTest);
        let res1 = map.reduce((pr, cr)=>pr&&cr);

        if (!wOC) {
            res1 &= elem.message !== undefined ? !elem.message.toLowerCase().includes(woc_string.toLowerCase()) : true;
        }
        if (res1 && elem.added_time !== undefined) {
            if (songs_per_day[elem.added_time]) {
                songs_per_day[elem.added_time].count++
            } else {
                songs_per_day[elem.added_time] = {
                    count: 1,
                    org: elem.added_time
                };
            }
        }
        return res1;
    });
    let error_days = Object.keys(songs_per_day).filter(key => {
        return songs_per_day[key].count !== state.songs_per_day
    }).map(elem => {
        const songsPerDay = songs_per_day[elem];
        songsPerDay.color = songs_per_day[elem].count > state.songs_per_day ? 'red' : 'blue';
        return songsPerDay
    });

    return {view_chart, error_days};
}
let sorting = {
    reaction: (array) => {
        array.sort((a, b) => b.reactions_num - a.reactions_num)
    },
    who: (array) => {
        array.sort((a, b) => {
            if (a.from_user < b.from_user)
                return -1;
            if (a.from_user > b.from_user)
                return 1;
            return 0;
        });

    },
    when: (array) => {
        array.sort((a, b) => b.added_time ? b.added_time.getTime() : 0 - a.added_time ? a.added_time.getTime() : 0);
    },
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

module.exports = {
    filterChart: _filterChart,
    sorting: sorting,
    subtractDaysFromDate: filters.subtractDaysFromDate,
    woc_string: woc_string
};