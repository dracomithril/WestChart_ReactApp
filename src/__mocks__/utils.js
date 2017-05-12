/**
 * Created by XKTR67 on 5/9/2017.
 */
let utils = jest.genMockFromModule('./../utils');
utils.subtractDaysFromDate
    .mockImplementationOnce((a, days) => {
        let since_date = new Date(a);
        since_date.setDate(new Date(a).getDate() - days);
        return since_date;
    });
module.exports = utils;