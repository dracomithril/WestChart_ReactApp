/**
 * Created by Gryzli on 24.01.2017.
 */
let request = require("request");
const group_id = '1707149242852457';
const access_token = '1173483302721639|M1wdI_6kHBG584FAXtK-LDVWNGo';
const api_ver = 'v2.8';
const limit = 100;
let days = 7;
let EventEmitter = require('events').EventEmitter;
let fieldsArr = ['story', 'from', 'link', 'caption', 'created_time', 'source', 'name', 'type', 'message', 'full_picture', 'updated_time', 'likes.limit(1).summary(true)'];
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
    let all_charts = [];
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
        method: 'GET',
        timeout: 2000
    };

    function reactOnBody(err, res, body) {
        if (err) {
            console.log('error: ' + err.message);
            console.log(body);
        } else {
            if (res.statusCode === 200) {
                let b = JSON.parse(body);
                all_charts.push(...b.data);
                if (b.paging && b.paging.next) {
                    request(b.paging.next, reactOnBody)
                } else {
                    callback(all_charts);

                }
            }
        }
    }

    request(options, reactOnBody)
}
/**
 *
 * @param scope
 * @param since
 * @param until
 * @private
 */
let _updateChart = function (scope, since, until) {
    let a_since, a_until;
    if (!until || !since) {
        let date = new Date();
        let since_date = new Date();
        since_date.setDate(date.getDate() - days);
        a_until = date.toISOString();
        a_since = since_date.toISOString();

    } else {
        a_since = since;
        a_until = until
    }

    obtainList(a_since, a_until, (body) => {
        let filter_yt = body.filter((elem) => {
            return elem.caption === 'youtube.com'
        });
        let chart1 = filter_yt.map((elem) => {
            return {
                created_time: new Date(elem.created_time),
                from_user: elem.from.name,
                full_picture: elem.full_picture,
                likes_num: elem.likes.summary.total_count,
                link: {
                    url: elem.link,
                    name: elem.name
                },
                message: elem.message,
                source: elem.source,
                type: elem.type,
                updated_time: new Date(elem.updated_time)
            };
        });
        chart1.sort((a, b) => a.likes_num - b.likes_num);
        chart1.reverse();
        scope.setChart(chart1, a_since);
    });
};
class Chart extends EventEmitter {
    /**
     *
     * @param update_interval {number}
     * @param show_days {number}
     */
    constructor(update_interval, show_days) {
        super();
        days=show_days;
        const cache = {
            last_update: '',
            chart: {},
            since: ''
        };
        this.setChart = function (chart, since) {
            let until = new Date().toISOString();
            cache.chart = chart;
            cache.last_update = until;
            cache.since = since;
            this.emit('change', cache);
        };
        const delay = updateInterval(update_interval);
        setInterval(_updateChart, delay, this);
    }

    UpdateChart(since, until) {
        _updateChart(this, since, until);
    }


}
module.exports = Chart;