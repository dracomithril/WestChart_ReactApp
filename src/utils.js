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
 * @returns {Array}
 * @private
 */
function _filterChart(state) {
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
            result &= elem.message !== undefined ? !elem.message.includes(woc_string) : true;
        }
        if (state.less_then_control) {
            result &= elem.reactions_num < state.less_then
        }
        if (state.more_then_control) {
            result &= elem.reactions_num > state.more_then;
        }

        return result
    });

    // if (state.more_then_control) {
    //     view_chart = view_chart.filter((elem) => elem.reactions_num > state.more_then);
    // }

    return view_chart;
}

module.exports = {
    filterChart: _filterChart,
    subtractDaysFromDate: subtractDaysFromDate,
    woc_string: woc_string
};