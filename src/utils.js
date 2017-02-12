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

    if (dateCreateControl) {
        let s11d = subtractDaysFromDate(until, state.show_created_in);
        let d2 = s11d.getTime();
        view_chart = view_chart.filter((elem) => {
            let d1 = new Date(elem.created_time).getTime();
            let result = d1 - d2;
            return result > 0;
        });
    }
    if (dateUpdateControl) {
        let s11d = subtractDaysFromDate(until, state.show_updated_in);
        let d2 = s11d.getTime();
        view_chart = view_chart.filter((elem) => {
            let d1 = new Date(elem.updated_time).getTime();
            let result = d1 - d2;
            return result > 0;
        });
    }
    if (dateAddedControl) {
        let s11d = subtractDaysFromDate(until, state.show_added_in);
        let d2 = s11d.getTime();
        view_chart = view_chart.filter((elem) => {
            let d1 = new Date(elem.added_time).getTime();
            let result = d1 - d2;
            return result > 0;
        });
    }
    if (!wOC) {
        view_chart = view_chart.filter((elem) =>  elem.message !== undefined ? !elem.message.includes(woc_string) : true)
    }
    if(state.reaction_count_control){
        view_chart= view_chart.filter((elem)=>(elem.reactions_num>state.more_then &&elem.reactions_num<state.less_then));
    }
    return view_chart;
}

module.exports={
    filterChart:_filterChart,
    subtractDaysFromDate:subtractDaysFromDate,
    woc_string:woc_string
};