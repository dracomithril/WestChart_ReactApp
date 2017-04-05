/**
 * Created by Gryzli on 05.04.2017.
 */

/**
 *
 * @param date {string}
 * @param until {Date}
 * @param days {number}
 * @returns {number}
 */
function countDays(date, until, days) {
    let cIn1 = new Date(date).getTime();
    return cIn1 - subtractDaysFromDate(until, days);
}
let more_or_less = function (reactions_num, condition, state) {
    switch (condition) {
        case 'less_then':
            return reactions_num < state[condition];
        case 'more_then':
            return reactions_num > state[condition];
        default:
            return true;
    }
};
/**
 *
 * @param until {Date}
 * @param days {number}
 * @returns {Date}
 */
function subtractDaysFromDate(until, days) {
    let since_date = new Date(until);
    since_date.setDate(new Date(until).getDate() - days);
    return since_date;
}
const filters = [{
    control: {name: "date_added_control", id:'add'},
    input: {max: 31, name: "add_control"},
    valueName: "added_time",
    description: {start: 'added in last ', end: ' days'},
    check: countDays
}, {
    control: {name: "date_create_control",id:'create'},
    input: {max: 31, name: "create_control"},
    valueName: "created_time",
    description: {start: 'created in last ', end: ' days'},
    check: countDays
}, {
    control: {name: "date_update_control", id:'update'},
    input: {max: 31, name: "update_control"},
    valueName: "updated_time",
    description: {start: 'updated in last ', end: ' days'},
    check: countDays
}, {
    control: {name: "more_then_control", id:'more'},
    input: {name: "more_control"},
    description: {start: 'more then '},
    check: more_or_less
}, {
    control: {name: "less_then_control",id:'less'},
    input: {name: "less_control"},
    description: {start: 'less then '},
    check: more_or_less
}];
export default {
    control: filters,
    subtractDaysFromDate: subtractDaysFromDate
};