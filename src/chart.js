/**
 * Created by Gryzli on 24.01.2017.
 */
import request from "request";
const group_id = '1707149242852457';
const access_token = '1173483302721639|M1wdI_6kHBG584FAXtK-LDVWNGo';
const api_ver = 'v2.8';
const limit = 100;
let EventEmitter =require('events').EventEmitter;

let fieldsArr = ['story', 'from', 'link', 'caption', 'created_time','source','name', 'type', 'full_picture', 'updated_time', 'likes.limit(1).summary(true)'];
let fields = fieldsArr.join(',');
// since=2017-01-15&until=2017-01-16
/**
 *
 * @param hours {number}
 */
function updateInterval(hours) {
    return hours * 60 * 60 * 1000;
}

function obtainList(callback) {
    let address = 'https://graph.facebook.com';
    let date = new Date(Date.now());
    let until = date.toISOString();
    let result = new Date();
    result.setDate(date.getDate() - 14);
    let since = result.toISOString();
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
let UpdateChart = function (scope) {
    obtainList((body) => {
        let filter_yt = body.data.filter((elem) => {
            return elem.caption === 'youtube.com'
        });
        let chart1 = filter_yt.map((elem) => {
            return {
                created_time: elem.created_time,
                from_user: elem.from.name,
                full_picture: elem.full_picture,
                likes_num: elem.likes.summary.total_count,
                link: elem.link,
                source:elem.source,
                link_name:elem.name,
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

        const cache = {
            last_update: '',
            chart: {}
        };
        this.setChart = function (chart) {
            cache.chart = chart;
            cache.last_update = new Date().toISOString();

            this.emit('change', cache);

        };
        UpdateChart(this);
        const delay = updateInterval(update_interval);
        setInterval(UpdateChart, delay, this);
    }

}

export default Chart;