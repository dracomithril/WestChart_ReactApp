/**
 * Created by Gryzli on 28.01.2017.
 */

const woc_string = "Wielkie Ogarnianie Charta";
/**
 *
 * @param until {Date}
 * @param days {number}
 * @returns {Date}
 */
function subtractDaysFromDate(until, days) {
    let since_date = new Date(until.toISOString());
    since_date.setDate(until.getDate() - days);
    return since_date;
}
/**
 *
 * @param state
 * @returns {{view_chart: (*), error_days: Array.<*>}}
 * @private
 */
function _filterChart(state) {
    let songs_per_day = {};
    let view_chart = state.chart;
    const until = state.until;
    const dateAddedControl = state.date_added_control;
    const dateCreateControl = state.date_create_control;
    const dateUpdateControl = state.date_update_control;
    const wOC = state.w_o_c;

    view_chart = view_chart.filter((elem) => {

        let result = true;
        if (dateCreateControl) {
            let cIn = subtractDaysFromDate(until, state.show_created_in);
            let cIn1 = new Date(elem.created_time).getTime();
            result &= (cIn1 - cIn.getTime()) > 0;
        }
        if (dateUpdateControl) {
            let uIn = subtractDaysFromDate(until, state.show_updated_in);
            let uIn1 = new Date(elem.updated_time).getTime();
            result &= (uIn1 - uIn.getTime()) > 0;
        }
        if (dateAddedControl) {
            let aIn = subtractDaysFromDate(until, state.show_added_in);
            let aIn1 = new Date(elem.added_time).getTime();
            result &= (aIn1 - aIn.getTime()) > 0;
        }
        if (!wOC) {
            result &= elem.message !== undefined ? !elem.message.toLowerCase().includes(woc_string.toLowerCase()) : true;
        }
        if (state.less_then_control) {
            result &= elem.reactions_num < state.less_then
        }
        if (state.more_then_control) {
            result &= elem.reactions_num > state.more_then;
        }
        if (result && elem.added_time !== undefined) {
            if (songs_per_day[elem.added_time]) {
                songs_per_day[elem.added_time].count++
            } else {
                songs_per_day[elem.added_time] = {
                    count: 1,
                    org: elem.added_time
                };
            }
        }

        return result;
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
    subtractDaysFromDate: subtractDaysFromDate,
    woc_string: woc_string
};