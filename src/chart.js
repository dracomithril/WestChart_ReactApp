/**
 * Created by Gryzli on 24.01.2017.
 */
let request = require("request");
const group_id = '1707149242852457';
let accessToken;
const api_ver = 'v2.8';
const limit = 100;
let days = 7;
let EventEmitter = require('events').EventEmitter;
let fieldsArr = ['story', 'from', 'link', 'caption', 'icon', 'created_time', 'source', 'name', 'type', 'message',
    'full_picture', 'updated_time', 'likes.limit(1).summary(true)', 'comments.limit(50).summary(true){message,from}'];
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
 * @param access_token {string}
 * @param callback {function}
 */
function obtainList(since, until, access_token, callback) {
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

class Chart extends EventEmitter {
    /**
     *
     * @param update_interval {number}
     * @param show_days {number}
     */
    constructor(update_interval, show_days) {
        super();
        if (show_days !== undefined) {
            days = show_days;
        }
        const cache = {
            last_update: '',
            chart: {}
        };
        this.setChart = function (chart) {
            let until = new Date().toISOString();
            cache.chart = chart;
            cache.last_update = until;
            this.emit('change', cache);
        };
        const delay = updateInterval(update_interval);
        setInterval(this.UpdateChart.bind(this), delay);
    }

    UpdateChart(since, until, access_token) {
        let scope = this;
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
        if (access_token) {
            accessToken = access_token;
        }


        obtainList(a_since, a_until, accessToken, (body) => {
            let chart1 = this.filterChartAndMap(body);
            scope.setChart(chart1);
        });
    }

    filterChartAndMap(body) {
        let filter_yt = body.filter((elem) => {
            return elem.caption === 'youtube.com'
        });
        return filter_yt.map((elem) => {
            let comments = elem.comments.data.filter((elem) => {
                const search = elem.message.match(/(\[Added)\s(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.](19|20)\d\d]/g);
                return (search !== null)
            });
            let addedTime = undefined;
            if (comments.length > 0) {
                const message = comments[0].message;
                const match = message.match(/(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.](19|20)\d\d/g)[0];
                const date = match.split(/[- \/.]/g);
                //todo test for added
                const year = Number(date[2]);
                const month = Number(date[1])-1;
                const day = Number(date[0]);
                addedTime = new Date(year,month,day);
            }
            return {
                added_time: addedTime,
                created_time: new Date(elem.created_time),
                from_user: elem.from.name,
                full_picture: elem.full_picture,
                likes_num: elem.likes.summary.total_count,
                link: {
                    url: elem.link,
                    name: elem.name
                },
                message: elem.message,
                selected: false,
                source: elem.source,
                type: elem.type,
                updated_time: new Date(elem.updated_time)
            };
        });
    }


}
module.exports = Chart;