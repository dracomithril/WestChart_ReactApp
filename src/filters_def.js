/**
 * Created by Gryzli on 05.04.2017.
 */

/**
 *
 * @returns {boolean}
 * @param elem
 * @param filter
 */
function countDays(elem, filter) {
    let date = elem[filter.valueName];
    const until = filter.until;
    const days = filter.days;
    let cIn1 = new Date(date).getTime();
    return (cIn1 - subtractDaysFromDate(until, days).getTime()) > 0;
}

let less_check = function (elem, filter) {
    return elem.reactions_num < filter.days;
};
let more_check = function (elem, filter) {
    return elem.reactions_num > filter.days;
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

const filters = [
    {
        control: {name: "date_create_control", id: 'create'},
        input: {max: 31, name: "create_control"},
        valueName: "created_time",
        description: {start: 'created in last ', end: ' days'},
        type: 'countDays',
        check: countDays
    },
    {
        control: {name: "date_update_control", id: 'update'},
        input: {max: 31, name: "update_control"},
        valueName: "updated_time",
        description: {start: 'updated in last ', end: ' days'},
        type: 'countDays',
        check: countDays
    }, {
        control: {name: "more_then_control", id: 'more'},
        input: {name: "more_control"},
        description: {start: 'more then '},
        type: 'more',
        check: more_check
    },
    {
        control: {name: "less_then_control", id: 'less'},
        input: {name: "less_control"},
        description: {start: 'less then '},
        type: 'less',
        check: less_check
    }];
let westletter = "WCS Weekly Westletter";
const woc_string = "Wielkie Ogarnianie Charta";
let text_check = function (elem, filter) {
    return elem.message !== undefined ? !elem.message.toLowerCase().includes(filter.text) : true;
};
const text_filters = [
    {
        control: {name: "woc_text_control", id: 'woc_cb'},
        input: {
            name: "woc_control"
        },
        text: woc_string.toLowerCase(),
        check: text_check
    }, {
        control: {name: "westletter_text_control", id: 'westletter_cb'},
        input: {
            name: "westletter_control"
        },
        text: westletter.toLowerCase(),
        check: text_check
    }
];
let exp = {
    control: filters,
    text:text_filters,
    subtractDaysFromDate: subtractDaysFromDate
};
module.exports = exp;
export default exp;