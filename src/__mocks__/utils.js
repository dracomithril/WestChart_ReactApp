/**
 * Created by XKTR67 on 5/9/2017.
 */



let utils = jest.genMockFromModule('./../utils');
function subtractDaysFromDate(until, days) {
    let since_date = new Date(until);
    since_date.setDate(new Date(until).getDate() - days);
    return since_date;
}
utils.subtractDaysFromDate=jest.fn(subtractDaysFromDate);

module.exports = utils;