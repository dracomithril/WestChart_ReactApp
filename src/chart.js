/**
 * Created by Gryzli on 24.01.2017.
 */
let request = require("request");
const group_id = '1707149242852457';
const access_token = '1173483302721639|M1wdI_6kHBG584FAXtK-LDVWNGo';
const api_ver = 'v2.8';
const limit = 100;
const days = 14;
let EventEmitter = require('events').EventEmitter;
let fieldsArr = ['story', 'from', 'link', 'caption', 'created_time', 'source', 'name', 'type', 'full_picture', 'updated_time', 'likes.limit(1).summary(true)'];
let fields = fieldsArr.join(',');
// since=2017-01-15&until=2017-01-16
/**
 *
 * @param minutes {number}
 */
function updateInterval(minutes) {
    return minutes * 60 * 1000;
}
/**
 *
 * @param since {string}
 * @param until {string}
 * @param callback {function}
 */
function obtainList(since, until, callback) {
    let address = 'https://graph.facebook.com';

    let query = {
        fields: fields,
        limit: limit,
        access_token: access_token,
        since: since,
        until: until

    };
    let path = `/${api_ver}/${group_id}/feed`;

    let options = {
        uri: path,
        baseUrl: address,
        qs: query,
        port: 443,
        path: path,
        method: 'GET'
    };

    request(options, function (err, res, body) {
        if (res.statusCode === 200) {
            callback(JSON.parse(body));
        } else {
            console.log('error: ' + res.statusCode);
            console.log(body);
        }
    });
}
/**
 *
 * @param scope
 * @param since
 * @param until
 * @private
 */
let _updateChart = function (scope, since, until) {
    obtainList(since, until, (body) => {
        let filter_yt = body.data.filter((elem) => {
            return elem.caption === 'youtube.com'
        });
        let d2 = new Date(since).getTime();
        let dateFilter = filter_yt.filter((elem) => {
            let d1 = new Date(elem.created_time).getTime();
            return d1 - d2 > 0;
        });
        let chart1 = dateFilter.map((elem) => {
            return {
                created_time: elem.created_time,
                from_user: elem.from.name,
                full_picture: elem.full_picture,
                likes_num: elem.likes.summary.total_count,
                link: elem.link,
                source: elem.source,
                link_name: elem.name,
                type: elem.type,
                updated_time: elem.updated_time
            };
        });
        chart1.sort((a, b) => a.likes_num - b.likes_num);
        chart1.reverse();
        scope.setChart(chart1);
    });
};
class Chart extends EventEmitter {
    /**
     *
     * @param update_interval {number}
     */
    constructor(update_interval) {
        super();

        let date = new Date();
        let until = date.toISOString();
        const cache = {
            last_update: '',
            chart: {}
        };
        this.setChart = function (chart) {
            cache.chart = chart;
            cache.last_update = until;

            this.emit('change', cache);

        };
        let since_date = new Date();
        since_date.setDate(date.getDate() - days);
        let since = since_date.toISOString();
        _updateChart(this, since, until);
        const delay = updateInterval(update_interval);
        setInterval(_updateChart, delay, this);
    }

    UpdateChart(since, until) {
        _updateChart(this, since, until);
    }


}
module.exports = Chart;