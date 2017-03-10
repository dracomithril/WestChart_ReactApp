/**
 * Created by Gryzli on 24.01.2017.
 */
let request = require("request");
let accessToken;
const api_ver = 'v2.8';
const limit = 100;
let days = 7;
let EventEmitter = require('events').EventEmitter;
let fieldsArr = ['story', 'from', 'link', 'caption', 'icon', 'created_time', 'source', 'name', 'type', 'message', 'attachments',
    'full_picture', 'updated_time', 'likes.limit(1).summary(true)', 'reactions.limit(1).summary(true)', 'comments.limit(50).summary(true){message,from}'];
let fields = fieldsArr.join(',');
// since=2017-01-15&until=2017-01-16

/**
 *
 * @param since {string}
 * @param until {string}
 * @param groupId {string}
 * @param access_token {string}
 * @param callback {function}
 */
function obtainList(since, until, groupId, access_token, callback) {
    let all_charts = [];
    let address = 'https://graph.facebook.com';

    let query = {
        fields: fields,
        limit: limit,
        access_token: access_token,
        since: since,
        until: until

    };
    let path = `/${api_ver}/${groupId}/feed`;

    let options = {
        uri: path,
        baseUrl: address,
        qs: query,
        port: 443,
        path: path,
        method: 'GET',
        timeout: 3000
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
        // const delay = updateInterval(update_interval);
        // setInterval(this.UpdateChart.bind(this), delay);
    }

    /**
     *
     * @param since {string}
     * @param until {string}
     * @param access_token {string}
     * @param groupId {string}
     * @constructor
     */
    UpdateChart(since, until, access_token, groupId) {
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


        obtainList(a_since, a_until, groupId, accessToken, (body) => {
            let chart1 = this.filterChartAndMap(body);
            scope.setChart(chart1);
        });
    }

    filterChartAndMap(body) {
        // let filter_yt = body.filter((elem) => {
        //     return //(elem.type === 'link')||(elem.type === 'video')
        // });
        const map = body.map((elem, id) => {
            let comments = elem.comments.data.filter((elem) => {
                const search = elem.message.match(/(\[Added)\s(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d]/g);
                return (search !== null)
            });
            let addedTime = undefined;
            let addedBy = undefined;
            if (comments.length > 0) {
                const message = comments[0].message;
                const match = message.match(/(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/g)[0];
                const date = match.split(/[- /.]/g);
                //todo test for added
                const year = Number(date[2]);
                const month = Number(date[1]) - 1;
                const day = Number(date[0]);
                addedTime = new Date(year, month, day);
                addedBy = comments[0].from.name;
            }
            let attachment = {};
            if (elem.attachments.data.length > 0) {
                attachment = elem.attachments.data[0];
            }


            const link = {
                url: elem.link,
                name: elem.name,
                title: attachment.type === 'music_aggregation' ? attachment.description : attachment.title,
                type: attachment.type
            };
            return {
                added_time: addedTime,
                added_by: addedBy,
                created_time: new Date(elem.created_time),
                from_user: elem.from.name,
                full_picture: elem.full_picture,
                id: id,
                likes_num: elem.likes.summary.total_count,
                link: link,
                message: elem.message,
                reactions_num: elem.reactions.summary.total_count,
                selected: false,
                source: elem.source,
                type: elem.type,
                updated_time: new Date(elem.updated_time)
            };
        });
        return map;
    }


}
module.exports = Chart;